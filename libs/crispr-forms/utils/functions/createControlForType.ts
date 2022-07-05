import { FormArray, FormControl } from "@angular/forms";
import { AnyFieldConfig, ControlType, ControlValue, CrisprControlConfig, FormConfig, FormGroupListConfig } from "../models";
import { buildFormGroupFromConfig } from "./buildFormGroupFromConfig";

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
