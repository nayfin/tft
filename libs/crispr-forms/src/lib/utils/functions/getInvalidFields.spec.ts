import {
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  minArrayLength,
  someControlIsValid,
} from '@tft/form-validation-handler';
import {
  AnyFieldConfig,
  ControlType,
  FormConfig,
  FormGroupListConfig,
  InputFieldConfig,
  SubGroupConfig,
} from '../models';
import { buildFormGroupFromConfig } from './buildFormGroupFromConfig';
import { createControlForType } from './createControlForType';
import { getInvalidFields } from './getInvalidFields';

const input = (
  controlName: string,
  extra: Partial<InputFieldConfig> = {}
): InputFieldConfig => ({
  controlType: ControlType.INPUT,
  controlName,
  label: controlName,
  inputType: 'text',
  ...extra,
});

const required = [Validators.required];

const subGroup = (
  controlName: string,
  fields: AnyFieldConfig[],
  extra: Partial<SubGroupConfig> = {}
): SubGroupConfig => ({
  controlType: ControlType.SUB_GROUP,
  controlName,
  fields,
  ...extra,
});

const list = (
  controlName: string,
  fields: AnyFieldConfig[],
  extra: Partial<FormGroupListConfig> = {}
): FormGroupListConfig => ({
  controlType: ControlType.GROUP_LIST,
  controlName,
  itemConfig: subGroup('item', fields),
  ...extra,
});

/** Adds an item group to the list, built the way the group list component builds one. */
function addItem(
  group: FormGroup,
  listConfig: FormGroupListConfig,
  value: Record<string, unknown> = {}
) {
  const item = createControlForType(
    listConfig.itemConfig,
    value as never
  ) as FormGroup;
  (group.get(listConfig.controlName as string) as FormArray).push(item);
  return item;
}

const failWith =
  (key: string): ValidatorFn =>
  () => ({ [key]: true });

describe('getInvalidFields', () => {
  describe('leaf fields', () => {
    it('returns an empty list for a valid form', () => {
      const config: FormConfig = {
        fields: [input('name', { validators: required })],
      };
      const group = buildFormGroupFromConfig(config);
      group.patchValue({ name: 'Ada' });

      expect(getInvalidFields(config, group)).toEqual([]);
    });

    it('follows the config order even when the group keys are in another order', () => {
      const config: FormConfig = {
        fields: [
          input('first', { validators: required }),
          input('second', { validators: required }),
          input('third', { validators: required }),
        ],
      };
      const group = new FormGroup({
        third: new FormControl(null, required),
        first: new FormControl(null, required),
        second: new FormControl(null, required),
      });

      expect(getInvalidFields(config, group).map((f) => f.path)).toEqual([
        'first',
        'second',
        'third',
      ]);
    });

    it('skips config entries without a control', () => {
      const config: FormConfig = {
        fields: [
          { controlType: ControlType.HEADING, label: 'Section' },
          { controlType: ControlType.DIVIDER },
          { controlType: ControlType.BUTTON, label: 'Send' },
          input('name', { validators: required }),
        ],
      };
      const group = buildFormGroupFromConfig(config);

      expect(getInvalidFields(config, group).map((f) => f.path)).toEqual([
        'name',
      ]);
    });

    it('skips a control that is missing from the group', () => {
      const config: FormConfig = {
        fields: [
          input('ghost', { validators: required }),
          input('name', { validators: required }),
        ],
      };
      const group = new FormGroup({ name: new FormControl(null, required) });

      expect(getInvalidFields(config, group).map((f) => f.path)).toEqual([
        'name',
      ]);
    });

    it('skips disabled controls', () => {
      const config: FormConfig = {
        fields: [
          input('a', { validators: required }),
          input('b', { validators: required }),
        ],
      };
      const group = buildFormGroupFromConfig(config);
      group.get('a').disable();
      // validators such as someControlIsValid set errors by hand, and setErrors still applies to a disabled control
      group.get('a').setErrors({ required: true });

      expect(getInvalidFields(config, group).map((f) => f.path)).toEqual(['b']);
    });

    it('skips a disabled sub-group', () => {
      const config: FormConfig = {
        fields: [
          input('name'),
          subGroup('address', [input('street', { validators: required })]),
        ],
      };
      const group = buildFormGroupFromConfig(config);
      group.get('address').disable();
      group.get('address.street').setErrors({ required: true });

      expect(getInvalidFields(config, group)).toEqual([]);
    });

    it('reports only the first error key of a control', () => {
      const config: FormConfig = {
        fields: [
          input('name', {
            validators: [failWith('first'), failWith('second')],
          }),
        ],
      };
      const group = buildFormGroupFromConfig(config);

      const fields = getInvalidFields(config, group);

      expect(fields).toHaveLength(1);
      expect(fields[0].errorKey).toBe('first');
    });

    it('labels a field with its label', () => {
      const config: FormConfig = {
        fields: [input('name', { label: 'Full name', validators: required })],
      };
      const group = buildFormGroupFromConfig(config);

      expect(getInvalidFields(config, group)[0].label).toBe('Full name');
    });

    it('falls back to the control name when there is no label', () => {
      const config: FormConfig = {
        fields: [
          { ...input('name', { validators: required }), label: undefined },
        ],
      };
      const group = buildFormGroupFromConfig(config);

      expect(getInvalidFields(config, group)[0].label).toBe('name');
    });

    it('does not use heading.label as the label of a leaf field', () => {
      const config: FormConfig = {
        fields: [
          input('name', {
            label: 'Full name',
            heading: { label: 'Personal' },
            validators: required,
          }),
        ],
      };
      const group = buildFormGroupFromConfig(config);

      expect(getInvalidFields(config, group)[0].label).toBe('Full name');
    });

    it('builds the message from the library defaults and passes the error value to it', () => {
      const config: FormConfig = {
        fields: [input('name', { validators: [Validators.minLength(5)] })],
      };
      const group = buildFormGroupFromConfig(config);
      group.patchValue({ name: 'abc' });

      const [field] = getInvalidFields(config, group);

      expect(field.errorKey).toBe('minlength');
      expect(field.message).toBe(
        'Minimum of 5 characters required, but you entered 3'
      );
      expect(field.control).toBe(group.get('name'));
    });

    it('prefers the form error dictionary over the defaults and keeps the defaults for other keys', () => {
      const config: FormConfig = {
        fields: [
          input('name', { validators: required }),
          input('mail', { validators: [Validators.email] }),
        ],
      };
      const group = buildFormGroupFromConfig(config);
      group.patchValue({ mail: 'nope' });

      const fields = getInvalidFields(config, group, {
        required: () => 'Fill this in',
      });

      expect(fields.map((f) => f.message)).toEqual([
        'Fill this in',
        'Please enter a valid email address',
      ]);
    });

    it('does not mark controls as touched', () => {
      const config: FormConfig = {
        fields: [input('name', { validators: required })],
      };
      const group = buildFormGroupFromConfig(config);

      getInvalidFields(config, group);

      expect(group.get('name').touched).toBe(false);
    });
  });

  describe('sub-groups', () => {
    it('reports the invalid leaves, not the group itself', () => {
      const config: FormConfig = {
        fields: [
          subGroup(
            'address',
            [
              input('street', { label: 'Street', validators: required }),
              input('city', { label: 'City', validators: required }),
            ],
            { heading: { label: 'Address' } }
          ),
        ],
      };
      const group = buildFormGroupFromConfig(config);

      const fields = getInvalidFields(config, group);

      expect(fields.map((f) => f.label)).toEqual([
        'Street in Address',
        'City in Address',
      ]);
      expect(fields.map((f) => f.control)).not.toContain(group.get('address'));
    });

    it('names a sub-group by its heading label when it has one', () => {
      const config: FormConfig = {
        fields: [
          subGroup(
            'address',
            [input('street', { label: 'Street', validators: required })],
            { heading: { label: 'Home address' } }
          ),
        ],
      };
      const group = buildFormGroupFromConfig(config);

      expect(getInvalidFields(config, group)[0].label).toBe(
        'Street in Home address'
      );
    });

    it('chains nested sub-group names from inner to outer', () => {
      const config: FormConfig = {
        fields: [
          subGroup(
            'person',
            [
              subGroup(
                'address',
                [input('street', { label: 'Street', validators: required })],
                { heading: { label: 'Address' } }
              ),
            ],
            { heading: { label: 'Person' } }
          ),
        ],
      };
      const group = buildFormGroupFromConfig(config);

      const [field] = getInvalidFields(config, group);

      expect(field.label).toBe('Street in Address in Person');
      expect(field.path).toBe('person.address.street');
      expect(field.testId).toBe('person.address.street');
    });

    it("does not report the group's own error when a child is reported", () => {
      const config: FormConfig = {
        fields: [
          subGroup(
            'address',
            [input('street', { label: 'Street', validators: required })],
            { validators: [failWith('groupBroken')] }
          ),
        ],
      };
      const group = buildFormGroupFromConfig(config);
      group.get('address').updateValueAndValidity();
      expect(group.get('address').errors).toEqual({ groupBroken: true });

      const fields = getInvalidFields(config, group);

      expect(fields.map((f) => f.errorKey)).toEqual(['required']);
    });

    it("reports the group's own error when no child is reported", () => {
      const config: FormConfig = {
        fields: [
          subGroup('address', [input('street', { label: 'Street' })], {
            heading: { label: 'Home address' },
            validators: [failWith('groupBroken')],
          }),
        ],
      };
      const group = buildFormGroupFromConfig(config);
      group.get('address').updateValueAndValidity();

      const fields = getInvalidFields(config, group, {
        groupBroken: () => 'Address is broken',
      });

      expect(fields).toHaveLength(1);
      expect(fields[0]).toMatchObject({
        label: 'Home address',
        path: 'address',
        testId: 'address',
        errorKey: 'groupBroken',
        message: 'Address is broken',
        control: group.get('address'),
      });
    });
  });

  describe('group lists', () => {
    const photoFields = [
      input('caption', { label: 'Caption', validators: required }),
    ];

    it('names list items like "Photo in Photos 2" by default, with the 1-based index', () => {
      const photos = list(
        'photos',
        [input('photo', { label: 'Photo', validators: required })],
        { heading: { label: 'Photos' } }
      );
      const config: FormConfig = { fields: [photos] };
      const group = buildFormGroupFromConfig(config);
      addItem(group, photos, { photo: 'a' });
      addItem(group, photos);

      const fields = getInvalidFields(config, group);

      expect(fields.map((f) => f.label)).toEqual(['Photo in Photos 2']);
    });

    it('uses the control name for the list when it has no heading', () => {
      const photos = list('photos', photoFields);
      const config: FormConfig = { fields: [photos] };
      const group = buildFormGroupFromConfig(config);
      addItem(group, photos);

      expect(getInvalidFields(config, group)[0].label).toBe(
        'Caption in photos 1'
      );
    });

    it('names items with itemLabelBuilder, passing the 0-based index, without repeating the list name', () => {
      const itemLabelBuilder = jest.fn((i: number) => `Photo ${i + 1}`);
      const photos = list(
        'photos',
        [input('photo', { label: 'Photo', validators: required })],
        {
          heading: { label: 'Photos' },
          itemLabelBuilder,
        }
      );
      const config: FormConfig = { fields: [photos] };
      const group = buildFormGroupFromConfig(config);
      addItem(group, photos, { photo: 'a' });
      addItem(group, photos);

      const fields = getInvalidFields(config, group);

      expect(itemLabelBuilder).toHaveBeenCalledWith(0);
      expect(itemLabelBuilder).toHaveBeenCalledWith(1);
      expect(fields.map((f) => f.label)).toEqual(['Photo in Photo 2']);
    });

    it('chains a sub-group inside a list item', () => {
      const photos = list(
        'photos',
        [
          subGroup(
            'address',
            [input('street', { label: 'Street', validators: required })],
            { heading: { label: 'Address' } }
          ),
        ],
        {
          heading: { label: 'Photos' },
        }
      );
      const config: FormConfig = { fields: [photos] };
      const group = buildFormGroupFromConfig(config);
      addItem(group, photos);
      addItem(group, photos);

      const fields = getInvalidFields(config, group);

      expect(fields.map((f) => f.label)).toEqual([
        'Street in Address in Photos 1',
        'Street in Address in Photos 2',
      ]);
      expect(fields.map((f) => f.path)).toEqual([
        'photos.0.address.street',
        'photos.1.address.street',
      ]);
      expect(fields.map((f) => f.testId)).toEqual([
        'photos[0].address.street',
        'photos[1].address.street',
      ]);
    });

    it('gives list item fields a path and test id', () => {
      const photos = list('photos', photoFields);
      const config: FormConfig = { fields: [photos] };
      const group = buildFormGroupFromConfig(config);
      addItem(group, photos, { caption: 'ok' });
      addItem(group, photos);

      const [field] = getInvalidFields(config, group);

      expect(field.path).toBe('photos.1.caption');
      expect(field.testId).toBe('photos[1].caption');
    });

    it('skips disabled list items', () => {
      const photos = list('photos', photoFields);
      const config: FormConfig = { fields: [photos] };
      const group = buildFormGroupFromConfig(config);
      addItem(group, photos).disable();
      addItem(group, photos);

      expect(getInvalidFields(config, group).map((f) => f.path)).toEqual([
        'photos.1.caption',
      ]);
    });

    it("does not report the list's own error when an item field is reported", () => {
      const photos = list('photos', photoFields, {
        validators: [minArrayLength(2)],
      });
      const config: FormConfig = { fields: [photos] };
      const group = buildFormGroupFromConfig(config);
      addItem(group, photos);
      expect(group.get('photos').errors).toHaveProperty('minArrayLength');

      const fields = getInvalidFields(config, group);

      expect(fields.map((f) => f.errorKey)).toEqual(['required']);
    });

    it("reports the list's own error when no item field is reported", () => {
      const photos = list('photos', photoFields, {
        heading: { label: 'Photos' },
        validators: [minArrayLength(2)],
      });
      const config: FormConfig = { fields: [photos] };
      const group = buildFormGroupFromConfig(config);
      addItem(group, photos, { caption: 'ok' });

      const fields = getInvalidFields(config, group);

      expect(fields).toHaveLength(1);
      expect(fields[0]).toMatchObject({
        label: 'Photos',
        path: 'photos',
        testId: 'photos',
        errorKey: 'minArrayLength',
        control: group.get('photos'),
      });
    });

    it("reports an item's own error when none of its fields are reported", () => {
      const photos = list('photos', [], {
        heading: { label: 'Photos' },
        itemConfig: subGroup('item', [input('caption', { label: 'Caption' })], {
          validators: [failWith('itemBroken')],
        }),
      });
      const config: FormConfig = { fields: [photos] };
      const group = buildFormGroupFromConfig(config);
      addItem(group, photos).updateValueAndValidity();

      const [field] = getInvalidFields(config, group);

      expect(field).toMatchObject({
        label: 'Photos 1',
        path: 'photos.0',
        testId: 'photos[0]',
        errorKey: 'itemBroken',
      });
    });
  });

  describe('form level errors', () => {
    it("reports the form's own error as 'Form' when no field is reported", () => {
      const config: FormConfig = {
        fields: [input('name')],
        validators: [failWith('formBroken')],
      };
      const group = buildFormGroupFromConfig(config);
      group.updateValueAndValidity();

      const fields = getInvalidFields(config, group, {
        formBroken: () => 'The form is broken',
      });

      expect(fields).toHaveLength(1);
      expect(fields[0]).toMatchObject({
        label: 'Form',
        path: '',
        testId: '',
        errorKey: 'formBroken',
        message: 'The form is broken',
        control: group,
      });
    });

    it("does not report the form's own error when a field is reported", () => {
      const config: FormConfig = {
        fields: [input('name', { validators: required })],
        validators: [failWith('formBroken')],
      };
      const group = buildFormGroupFromConfig(config);
      group.updateValueAndValidity();
      expect(group.errors).toEqual({ formBroken: true });

      expect(getInvalidFields(config, group).map((f) => f.errorKey)).toEqual([
        'required',
      ]);
    });

    it('reports the fields marked by someControlIsValid, not the form', () => {
      const config: FormConfig = {
        fields: [
          input('a', { label: 'A', validators: required }),
          input('b', { label: 'B', validators: required }),
        ],
        validators: [someControlIsValid(['a', 'b'])],
      };
      const group = buildFormGroupFromConfig(config);
      group.updateValueAndValidity();

      const fields = getInvalidFields(config, group);

      expect(fields.map((f) => f.label)).toEqual(['A', 'B']);
      expect(fields.every((f) => f.errorKey === 'someControlIsValid')).toBe(
        true
      );
    });

    it('returns an empty list for a disabled form', () => {
      const config: FormConfig = {
        fields: [input('name', { validators: required })],
      };
      const group = buildFormGroupFromConfig(config);
      group.disable();

      expect(getInvalidFields(config, group)).toEqual([]);
    });
  });

  describe('path and testId', () => {
    it('uses the control name for both by default', () => {
      const config: FormConfig = {
        fields: [input('name', { validators: required })],
      };
      const group = buildFormGroupFromConfig(config);

      expect(getInvalidFields(config, group)[0]).toMatchObject({
        path: 'name',
        testId: 'name',
      });
    });

    it('prefers config.testId over the control name for testId only', () => {
      const config: FormConfig = {
        fields: [input('name', { testId: 'full-name', validators: required })],
      };
      const group = buildFormGroupFromConfig(config);

      expect(getInvalidFields(config, group)[0]).toMatchObject({
        path: 'name',
        testId: 'full-name',
      });
    });

    it('prefixes the testId of a sub-group field with the sub-group test id', () => {
      const config: FormConfig = {
        fields: [
          subGroup(
            'address',
            [input('street', { testId: 'road', validators: required })],
            { testId: 'home' }
          ),
        ],
      };
      const group = buildFormGroupFromConfig(config);

      expect(getInvalidFields(config, group)[0]).toMatchObject({
        path: 'address.street',
        testId: 'home.road',
      });
    });

    it('prefixes list item fields with the list test id and index', () => {
      const photos = list(
        'photos',
        [input('caption', { testId: 'cap', validators: required })],
        { testId: 'gallery' }
      );
      const config: FormConfig = { fields: [photos] };
      const group = buildFormGroupFromConfig(config);
      addItem(group, photos);

      expect(getInvalidFields(config, group)[0]).toMatchObject({
        path: 'photos.0.caption',
        testId: 'gallery[0].cap',
      });
    });
  });
});
