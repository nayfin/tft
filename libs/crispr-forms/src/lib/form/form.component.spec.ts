import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import {
  ControlType,
  FormConfig,
  FormGroupListConfig,
  createControlForType,
} from '../utils';
import { CrisprFormComponent } from './form.component';

describe('CrisprFormComponent', () => {
  let component: CrisprFormComponent;
  let fixture: ComponentFixture<CrisprFormComponent>;

  const config: FormConfig = {
    fields: [
      {
        controlName: 'name',
        controlType: ControlType.INPUT,
        label: 'Name',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrisprFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrisprFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build a control on the form for each control in the config', () => {
    expect(component.form().get('name')).toBeTruthy();
  });

  it('should render a field for each field in the config', () => {
    expect(
      fixture.nativeElement.querySelectorAll('crispr-input-field').length
    ).toBe(1);
  });

  it('should emit the form and mark it touched when submitted', () => {
    const submitted = jest.fn();
    component.submitted.subscribe(submitted);

    component.handleSubmit();

    expect(submitted).toHaveBeenCalledWith(component.form());
    expect(component.form().touched).toBe(true);
  });

  describe('invalidFields and invalidSubmit', () => {
    const photos: FormGroupListConfig = {
      controlType: ControlType.GROUP_LIST,
      controlName: 'photos',
      heading: { label: 'Photos' },
      itemConfig: {
        controlType: ControlType.SUB_GROUP,
        controlName: 'item',
        fields: [
          {
            controlType: ControlType.INPUT,
            controlName: 'caption',
            label: 'Caption',
            validators: [Validators.required],
          },
        ],
      },
    };

    const formConfig: FormConfig = {
      errorDictionary: { required: () => 'Fill this in' },
      fields: [
        {
          controlType: ControlType.INPUT,
          controlName: 'name',
          label: 'Name',
          validators: [Validators.required],
        },
        {
          controlType: ControlType.INPUT,
          controlName: 'mail',
          label: 'Email',
          validators: [Validators.email],
        },
        {
          controlType: ControlType.SUB_GROUP,
          controlName: 'address',
          heading: { label: 'Address' },
          fields: [
            {
              controlType: ControlType.INPUT,
              controlName: 'street',
              label: 'Street',
              validators: [Validators.required],
            },
          ],
        },
        photos,
      ],
    };

    async function createForm(formConfigToUse: FormConfig) {
      const formFixture = TestBed.createComponent(CrisprFormComponent);
      formFixture.componentRef.setInput('config', formConfigToUse);
      await formFixture.whenStable();
      return formFixture;
    }

    const labels = (c: CrisprFormComponent) =>
      c.invalidFields().map((f) => f.label);

    it('lists the invalid fields in config order before anything is touched', async () => {
      const { componentInstance: form } = await createForm(formConfig);

      expect(form.form().touched).toBe(false);
      expect(labels(form)).toEqual(['Name', 'Street in Address']);
    });

    it('shrinks as fields are filled and grows again when they are cleared', async () => {
      const { componentInstance: form } = await createForm(formConfig);

      form.form().get('name').setValue('Ada');
      expect(labels(form)).toEqual(['Street in Address']);

      form.form().get('address.street').setValue('Main St');
      expect(labels(form)).toEqual([]);

      form.form().get('name').setValue('');
      expect(labels(form)).toEqual(['Name']);
    });

    it('updates when an error is set on a child control by hand', async () => {
      const { componentInstance: form } = await createForm(formConfig);
      form.form().patchValue({ name: 'Ada', address: { street: 'Main St' } });
      expect(labels(form)).toEqual([]);

      form.form().get('mail').setErrors({ taken: true });

      expect(form.invalidFields().map((f) => f.errorKey)).toEqual(['taken']);
    });

    it('uses the errorDictionary from the config and the defaults for other keys', async () => {
      const { componentInstance: form } = await createForm(formConfig);
      form.form().patchValue({ mail: 'nope', address: { street: 'Main St' } });

      expect(form.invalidFields().map((f) => f.message)).toEqual([
        'Fill this in',
        'Please enter a valid email address',
      ]);
    });

    it('excludes a disabled field and includes it again when it is re-enabled', async () => {
      const { componentInstance: form } = await createForm(formConfig);

      form.form().get('name').disable();
      expect(labels(form)).toEqual(['Street in Address']);

      form.form().get('name').enable();
      expect(labels(form)).toEqual(['Name', 'Street in Address']);
    });

    it('picks up a group list item being added and removed', async () => {
      const { componentInstance: form } = await createForm(formConfig);
      form.form().patchValue({ name: 'Ada', address: { street: 'Main St' } });
      expect(labels(form)).toEqual([]);
      const list = form.form().get('photos') as FormArray;

      list.push(createControlForType(photos.itemConfig) as FormGroup);
      expect(labels(form)).toEqual(['Caption in Photos 1']);

      list.removeAt(0);
      expect(labels(form)).toEqual([]);
    });

    it('keeps the same array when only the touched state changes', async () => {
      const { componentInstance: form } = await createForm(formConfig);
      const before = form.invalidFields();

      form.form().get('name').markAsTouched();
      form.form().markAllAsTouched();

      expect(form.invalidFields()).toBe(before);
    });

    it('keeps the same array when revalidating does not change what is invalid', async () => {
      const { componentInstance: form } = await createForm(formConfig);
      const before = form.invalidFields();

      form.form().updateValueAndValidity();
      form.form().get('name').updateValueAndValidity();

      expect(form.invalidFields()).toBe(before);
    });

    describe('when the message or error of a field changes', () => {
      const codeConfig: FormConfig = {
        fields: [
          {
            controlType: ControlType.INPUT,
            controlName: 'code',
            label: 'Code',
            validators: [Validators.required, Validators.minLength(5)],
          },
        ],
      };

      it('returns a new array when the message changes but the error key stays', async () => {
        const { componentInstance: form } = await createForm(codeConfig);
        form.form().get('code').setValue('ab');
        const before = form.invalidFields();
        expect(before[0].message).toBe(
          'Minimum of 5 characters required, but you entered 2'
        );

        form.form().get('code').setValue('abc');

        const after = form.invalidFields();
        expect(after).not.toBe(before);
        expect(after[0].errorKey).toBe('minlength');
        expect(after[0].message).toBe(
          'Minimum of 5 characters required, but you entered 3'
        );
      });

      it('returns a new array when the error key changes on the same field', async () => {
        const { componentInstance: form } = await createForm(codeConfig);
        const before = form.invalidFields();
        expect(before[0].errorKey).toBe('required');

        form.form().get('code').setValue('ab');

        const after = form.invalidFields();
        expect(after).not.toBe(before);
        expect(after[0].errorKey).toBe('minlength');
      });
    });

    it('follows the form when the form input is replaced', async () => {
      const formFixture = await createForm(formConfig);
      expect(labels(formFixture.componentInstance)).toEqual([
        'Name',
        'Street in Address',
      ]);
      const other = new FormGroup({
        name: createControlForType(formConfig.fields[0] as never),
        mail: createControlForType(formConfig.fields[1] as never),
        address: createControlForType(formConfig.fields[2] as never),
        photos: createControlForType(photos),
      });
      other.patchValue({ name: 'Ada' });

      formFixture.componentRef.setInput('form', other);
      await formFixture.whenStable();
      expect(labels(formFixture.componentInstance)).toEqual([
        'Street in Address',
      ]);

      other.get('address.street').setValue('Main St');
      expect(labels(formFixture.componentInstance)).toEqual([]);
    });

    it('emits invalidSubmit once with the invalid fields, and still emits submitted, on an invalid submit', async () => {
      const { componentInstance: form } = await createForm(formConfig);
      const submitted = jest.fn();
      const invalidSubmit = jest.fn();
      form.submitted.subscribe(submitted);
      form.invalidSubmit.subscribe(invalidSubmit);

      form.handleSubmit();

      expect(submitted).toHaveBeenCalledTimes(1);
      expect(submitted).toHaveBeenCalledWith(form.form());
      expect(invalidSubmit).toHaveBeenCalledTimes(1);
      expect(invalidSubmit.mock.calls[0][0]).toEqual(form.invalidFields());
      expect(
        invalidSubmit.mock.calls[0][0].map((f: { label: string }) => f.label)
      ).toEqual(['Name', 'Street in Address']);
    });

    it('emits submitted but not invalidSubmit on a valid submit', async () => {
      const { componentInstance: form } = await createForm(formConfig);
      form.form().patchValue({ name: 'Ada', address: { street: 'Main St' } });
      const submitted = jest.fn();
      const invalidSubmit = jest.fn();
      form.submitted.subscribe(submitted);
      form.invalidSubmit.subscribe(invalidSubmit);

      form.handleSubmit();

      expect(submitted).toHaveBeenCalledTimes(1);
      expect(invalidSubmit).not.toHaveBeenCalled();
    });

    it('behaves the same when submitted through the hidden trigger button', async () => {
      const { componentInstance: form } = await createForm(formConfig);
      const submitted = jest.fn();
      const invalidSubmit = jest.fn();
      form.submitted.subscribe(submitted);
      form.invalidSubmit.subscribe(invalidSubmit);

      form.triggerSubmit();
      expect(submitted).toHaveBeenCalledTimes(1);
      expect(invalidSubmit).toHaveBeenCalledTimes(1);
      expect(invalidSubmit.mock.calls[0][0]).toEqual(form.invalidFields());

      form.form().patchValue({ name: 'Ada', address: { street: 'Main St' } });
      form.triggerSubmit();
      expect(submitted).toHaveBeenCalledTimes(2);
      expect(invalidSubmit).toHaveBeenCalledTimes(1);
    });

    it('reports a form-level validator error on a fresh form that has not been touched', async () => {
      const brokenConfig: FormConfig = {
        validators: [() => ({ formBroken: true })],
        errorDictionary: { formBroken: () => 'The form is broken' },
        fields: [
          {
            controlType: ControlType.INPUT,
            controlName: 'name',
            label: 'Name',
          },
        ],
      };
      const { componentInstance: form } = await createForm(brokenConfig);
      const invalidSubmit = jest.fn();
      form.invalidSubmit.subscribe(invalidSubmit);
      // buildFormGroupFromConfig sets the validators without running them, so check they have run by now
      expect(form.form().errors).toEqual({ formBroken: true });

      form.handleSubmit();

      expect(invalidSubmit).toHaveBeenCalledTimes(1);
      expect(invalidSubmit.mock.calls[0][0]).toEqual([
        expect.objectContaining({
          label: 'Form',
          errorKey: 'formBroken',
          message: 'The form is broken',
        }),
      ]);
    });
  });
});
