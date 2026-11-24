import type { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { ErrorDictionary, getErrorMessage } from '@tft/form-validation-handler';
import {
  AbstractGroupConfig,
  ControlType,
  CrisprControlConfig,
  CrisprFieldConfig,
  FormConfig,
  FormGroupListConfig,
  InvalidField,
  SubGroupConfig,
} from '../models';
import { isControlConfig } from './isControlConfig';

/** Where a group's fields sit in the form. */
interface GroupContext {
  /** Dot path of the group's control, '' for the top-level form. */
  path: string;
  /** The names of the group and the groups around it, inner to outer, e.g. `Address in Photos 2`. Null at the top level. */
  nameChain: string | null;
}

/**
 * Lists the invalid fields of a form, in config order, one entry per field.
 *
 * - Each entry is built from the field's first error, with messages from `errorDictionary` before the library defaults.
 * - Sub-groups and group lists are walked and their invalid leaves reported, named like `Street in Address`
 *   or `Photo in Photos 2`. A group's, list's, item's or the form's own validator error is reported
 *   only when none of its children are.
 * - Disabled controls, config entries without a control and controls missing from the group are skipped.
 *
 * Pure: touches nothing and ignores touched/dirty state.
 * @param config the config the form was built from
 * @param group the form group built from the config
 * @param errorDictionary the form's custom error messages
 */
export function getInvalidFields(
  config: FormConfig | AbstractGroupConfig,
  group: FormGroup,
  errorDictionary?: ErrorDictionary
): InvalidField[] {
  if (group.disabled) {
    return [];
  }
  const context: GroupContext = { path: '', nameChain: null };
  const children = collectFromFields(
    config.fields,
    group,
    context,
    errorDictionary
  );
  return children.length
    ? children
    : ownError(group, 'Form', '', errorDictionary);
}

function collectFromFields(
  fieldConfigs: CrisprFieldConfig[] | undefined,
  group: FormGroup,
  context: GroupContext,
  errorDictionary?: ErrorDictionary
): InvalidField[] {
  const invalidFields: InvalidField[] = [];
  for (const fieldConfig of fieldConfigs ?? []) {
    if (!isControlConfig(fieldConfig)) {
      continue;
    }
    const controlName = String(fieldConfig.controlName);
    const control = group.get(controlName);
    if (!control || control.disabled) {
      continue;
    }
    const path = joinPath(context.path, controlName);

    if (fieldConfig.controlType === ControlType.SUB_GROUP && isGroup(control)) {
      invalidFields.push(
        ...collectFromSubGroup(
          fieldConfig as SubGroupConfig,
          control,
          path,
          context,
          errorDictionary
        )
      );
    } else if (
      fieldConfig.controlType === ControlType.GROUP_LIST &&
      isArray(control)
    ) {
      invalidFields.push(
        ...collectFromList(
          fieldConfig as FormGroupListConfig,
          control,
          path,
          context,
          errorDictionary
        )
      );
    } else {
      const label = withChain(fieldLabel(fieldConfig), context.nameChain);
      invalidFields.push(...ownError(control, label, path, errorDictionary));
    }
  }
  return invalidFields;
}

function collectFromSubGroup(
  config: SubGroupConfig,
  group: FormGroup,
  path: string,
  parent: GroupContext,
  errorDictionary?: ErrorDictionary
): InvalidField[] {
  const nameChain = withChain(groupName(config), parent.nameChain);
  const context: GroupContext = { path, nameChain };
  const children = collectFromFields(
    config.fields,
    group,
    context,
    errorDictionary
  );
  return children.length
    ? children
    : ownError(group, nameChain, path, errorDictionary);
}

function collectFromList(
  config: FormGroupListConfig,
  list: FormArray,
  path: string,
  parent: GroupContext,
  errorDictionary?: ErrorDictionary
): InvalidField[] {
  const listName = groupName(config);
  const invalidItems: InvalidField[] = [];
  list.controls.forEach((item, i) => {
    if (item.disabled || !isGroup(item)) {
      return;
    }
    // the builder gets the 0-based index, like the list's template does. The default name is 1-based.
    const itemName = config.itemLabelBuilder
      ? config.itemLabelBuilder(i)
      : `${listName} ${i + 1}`;
    const context: GroupContext = {
      path: joinPath(path, String(i)),
      nameChain: withChain(itemName, parent.nameChain),
    };
    const children = collectFromFields(
      config.itemConfig?.fields,
      item,
      context,
      errorDictionary
    );
    invalidItems.push(
      ...(children.length
        ? children
        : ownError(item, context.nameChain, context.path, errorDictionary))
    );
  });
  return invalidItems.length
    ? invalidItems
    : ownError(
        list,
        withChain(listName, parent.nameChain),
        path,
        errorDictionary
      );
}

/** The entry for a control's own errors (its first one), or an empty list when it has none. */
function ownError(
  control: AbstractControl,
  label: string | null,
  path: string,
  errorDictionary?: ErrorDictionary
): InvalidField[] {
  const errors = control.errors;
  const message = getErrorMessage(errors, errorDictionary);
  if (!errors || message === null) {
    return [];
  }
  return [
    {
      path,
      label: label ?? '',
      message,
      errorKey: Object.keys(errors)[0],
      control,
    },
  ];
}

/** A leaf field's name: its label, else its heading's label, else its control name. */
function fieldLabel(config: CrisprControlConfig): string {
  return (
    (config as { label?: string }).label ||
    config.heading?.label ||
    String(config.controlName)
  );
}

/** A group's or list's name: its heading label, or its control name when it has none. */
function groupName(config: CrisprControlConfig): string {
  return config.heading?.label || String(config.controlName);
}

function withChain(name: string, chain: string | null): string {
  return chain ? `${name} in ${chain}` : name;
}

function joinPath(prefix: string, segment: string): string {
  return prefix ? `${prefix}.${segment}` : segment;
}

function isGroup(control: AbstractControl): control is FormGroup {
  return 'controls' in control && !Array.isArray(control.controls);
}

function isArray(control: AbstractControl): control is FormArray {
  return 'controls' in control && Array.isArray(control.controls);
}
