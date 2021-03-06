import {
  SelectOption,
  DEFAULT_EMPTY_OPTIONS_MESSAGE,
  AnyFieldConfig,
  FormConfig,
  ControlType,
  FormGroupListConfig,
  CrisprControlConfig,
  OptionsType,
  AutocompleteOptionsCallback,
  CrisprFieldConfig,
  ControlValue
} from './models';
import {
  from,
  Observable,
  of,
  isObservable,
  combineLatest,
  OperatorFunction
} from 'rxjs';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { valueIn } from './form.operators';
import { map, startWith } from 'rxjs/operators';

/**
 * DYNAMIC FORM UTILS: a collection of pure/mostly pure functions that are useful both internally and for
 * developing the consuming app.
 *
 * They are sorted by use case: building out the form object; helper functions to use with the disabled$ function;
 * helper functions to use with the compute field function; and other logic shared between components
 */

/**
 * Required configuration to use with checkControlForValues function
 */
export interface CheckControlConfig {
  // the control name to watch
  controlName: string;
  // the values to watch for
  values: string[];
  // the function to run on the boolean returned by the watcher
  evaluate?: (isValueInValues: boolean) => boolean;
}

/**
* Watches a single control for a list of values, returns true when field value matches any value in list
* unless an evaluate method is found on config, in which case that method is run on the returned boolean value
* @param group the direct parent of the field we want to watch
* @param config
*/
export function checkControlForValues(group: FormGroup, config: CheckControlConfig): Observable<boolean> {
  // check that all the pieces we need are available
  if (config && config.controlName && Array.isArray(config.values)) {
    return getValueChanges(group, config.controlName).pipe(
      // return a boolean, true if value is in the values being watch for, otherwise false
      valueIn(config.values),
      map((isValueInValues: boolean) => {
        // since we can only check if the value is in the list of watched values, the evaluate function gives us
        // a chance to make other decisions based on if the boolean returned, e.g. return true if value not in watched values
        if ( config.evaluate && config.evaluate instanceof Function ) {
          return config.evaluate(isValueInValues);
        } else { return isValueInValues; }
      })
    );
  } else {
    //
    return of(true);
  }
}

/**
 * The required configuration for running the checkControlsForValues function.
 */
export interface CheckControlsConfig {
  // an array of controls to watch and the values to check for
  watchConfigs: CheckControlConfig[];
  // the function to run against the array of current field valueIn responses
  evaluate?: ( bools: boolean[] ) => boolean;
}

/**
 * Watches a list of fields for individual lists of values returning true when any field contains one
 * of the values being watched for, or optionally running a function on the array of resolved booleans
 * from the listed fields and returning a boolean
 * @param group the form group that has the fields to watch as direct descendants
 * @param config the configuration to use when calling the function
 */
export function checkControlsForValues(group: FormGroup, config: CheckControlsConfig): Observable<any> {
  // if no config is passed we just want to show the field, so we return an observable of true
  if (!config || !config.watchConfigs) { return of(true); }
  // we run checkControlForValues on every control in the list of WatchConfigs creating
  // an array of Observable watching fields for values
  const fieldTriggers = config.watchConfigs.map(watchConfig => {
    // resolves a boolean, true when field value matches a watched value, otherwise false
    return checkControlForValues(group, watchConfig);
  });

  return combineLatest(
    fieldTriggers
  ).pipe(
    startWith([true]),
    map((booleans: boolean[]) => {
      // if the user passed an evaluate function use it
      if (config.evaluate && config.evaluate instanceof Function) {
        return config.evaluate(booleans);
      } else { // otherwise we return true if any of the watched fields resolve to true
        return booleans.some(bool => bool);
      }
    })
  );
}

/**
 * The required configuration when running the computeValue function
 */
export interface ComputeFieldConfig<T = any, RT = any> {
  // array of control names who's values we want to watch
  controlNamesToWatch: string[];
  // the function we want to call on the array of watched values to compute the value of the control we
  computeCallback: (
    values: (T)[]
  ) => RT;
}

/**
 * Watches values on an array of fields, computing their values as they change
 * @param group the group to get the fields from, for now it can only be the parent of the computed field
 * @param computeFieldsConfig the configuration that drives the computation, holds the names to watch and the
 * computation function that get called against the array of values
 */
export function computeValueFromFields(group: FormGroup, computeFieldsConfig: ComputeFieldConfig): Observable<any> {
  // TODO: better checking
  const { controlNamesToWatch } = computeFieldsConfig;
  //creates an observable listener for each control in the controlNamesToWatch array
  return combineLatest(
    controlNamesToWatch.map(controlNameToWatch => getValueChanges(group, controlNameToWatch))
  ).pipe(
    // each time a watched field values changes a new array of the latest field values is pipe through to the
    // compute callback. Which runs the users logic on the values to compute this fields value
    map(valuesArray => computeFieldsConfig.computeCallback(valuesArray)),
  );
}

/**
 * A simple wrapper for doing error checking around getting the valueChanges observable from a control on a form group
 * @param group the form group we want to pull the observable from
 * @param controlName the name of the control who's value we want to subscribe to
 */
function getValueChanges(group: FormGroup, controlName: string) {
  const control = group.get(controlName);
  if (!control) {
    throw new Error(`No control with controlName ${controlName}`, );
  }
  return control.valueChanges;
}
/**
 *  TODO: move to utils library after library is built
 *  Allows developer to pass an array of operators into the pipe of an Observable.
 *  Useful for creating function with a variable amount of operators to be run
 * @param observable the observable to pass the operators to
 * @param operators array of operators to pipe
 */
function pipeOperatorsIntoObservable(observable: Observable<any>, operators: OperatorFunction<any, any>[]) {
  try {
    return operators.reduce((obs: Observable<{}>, op: OperatorFunction<{}, {}>) => {
      return obs.pipe(op);
    }, observable);
  } catch {
    console.error('Unable to pipe operators into observable');
    return of(null);
  }
}


export function callOptionsIfFunction(
  options: OptionsType | AutocompleteOptionsCallback,
  parentGroup?: FormGroup,
  searchString?: string
): OptionsType {
  return options instanceof Function ? options(parentGroup, searchString) : options;
}
/**
 * The user can give us select options as an array, a function that resolves to a promise,
 * or an observable. This functions consumes any of those and returns an observable that
 * resolves an array of options
 *
 * @param options the options passed in from the config
 * @param emptyMessageOption the message to display when the array is empty
 */
export function observablifyOptions(
  options: OptionsType,
  parentGroup: FormGroup,
  searchString?: string,
  emptyOptionsMessage?: string,
): Observable<SelectOption[]> {
  const calledOptions = callOptionsIfFunction(options, parentGroup, searchString);
  // if options are a promise
  return calledOptions instanceof Promise
  // convert to observable
  ? from(calledOptions)
  // if array that isn't empty
  : Array.isArray(calledOptions) && calledOptions.length
  // convert to observable
  ? of(calledOptions)
  // if observable
  : isObservable(calledOptions)
  // return it
  ? calledOptions
  // else return empty option
  : of([
    {
      label: emptyOptionsMessage || DEFAULT_EMPTY_OPTIONS_MESSAGE,
      value: null
    }
  ]);
}

/**
 * Determines if the field config is for a form control (not a divider, heading or other non-control field)
 *  */
export function isControlConfig(fieldConfig: CrisprFieldConfig): fieldConfig is CrisprControlConfig {
  return 'controlName' in fieldConfig;
}
/**
 * builds out form group based on config
 * @param config a configuration for a form group
 * @param value an object of initial values to pass in
 * @param group the form group to modify and build out
 */
export function buildFormGroupFromConfig(config: FormConfig, value = null, group: FormGroup = new FormGroup({}) ) {
  config.fields.forEach( (controlConfig: AnyFieldConfig) => {
    if (isControlConfig(controlConfig)) {
      // then add a control to the group using the controlName from configuration
      const {controlName} = controlConfig;
      // if there's a value object and it has a non-null/undefined value for this field use it.
      // Otherwise, default to null
      const controlValue = (value && value[controlName]) ?? null;
      group.addControl(controlName, createControlForType(controlConfig, controlValue));
    }
  });
  group.setValidators(config.validators)
  return group;
}

/**
 * Analyze the config and build a form control to spec. Notice we don't use FormBuilder here
 * as we want to keep this function pure.
 * @param controlConfig the configuration object for the control to build
 * @param value an initial value to use if passed in
 */
export function createControlForType(controlConfig: AnyFieldConfig, value: ControlValue = null)  {
  // build form control out based on the control type
  const control = controlConfig.controlType === ControlType.SUB_GROUP
    ? buildFormGroupFromConfig(controlConfig as FormConfig, value)
    : controlConfig.controlType === ControlType.GROUP_LIST
    ? new FormArray([], (controlConfig as FormGroupListConfig).validators)
    : new FormControl(
      value || null,
      (controlConfig as CrisprControlConfig).validators
    );

  return control;
}

/**
 * A basic filter function that filters the search string against the label of the options object
 * @param options the array of options to filter
 * @param searchString the string from the input
 */
export function filterOptionsByLabel(options: SelectOption[], searchString: string)  {
  return options.filter(option => {
    return option.label && option.label.toLowerCase().includes(searchString.toLowerCase());
  });
}
