import { FormGroup } from "@angular/forms";
import { AnyFieldConfig, FormConfig } from "../models";
import { createControlForType } from "./createControlForType";
import { isControlConfig } from "./isControlConfig";

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
      if (group.get(controlName)) {
        group.removeControl(controlName);
      }
      // if there's a value object and it has a non-null/undefined value for this field use it.
      // Otherwise, default to null
      const controlValue = (value && value[controlName]) ?? null;
      const control = createControlForType(controlConfig, controlValue)
      group.addControl(controlName, control);
    }
  });
  group.setValidators(config.validators);
  return group;
}
