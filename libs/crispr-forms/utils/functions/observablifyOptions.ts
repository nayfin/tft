import { FormGroup } from "@angular/forms";
import { from, isObservable, Observable, of } from "rxjs";
import { OptionsType, SelectOption } from "../models";
import { callOptionsIfFunction } from "./callOptionsIfFunction";

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
): Observable<SelectOption[]> {
  const calledOptions = callOptionsIfFunction(options, parentGroup, searchString);
  // if options are a promise
  const observableOptions = calledOptions instanceof Promise
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
  // else an empty array
  : of([]);
  return observableOptions;
}
