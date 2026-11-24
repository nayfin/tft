import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ControlType, FormConfig, InvalidErrorsConfig } from '../utils';
import { CrisprFormComponent } from './form.component';
import { InvalidFieldsSnackBarComponent } from './invalid-fields-snack-bar/invalid-fields-snack-bar.component';

const input = (controlName: string, label: string, required = true) => ({
  controlType: ControlType.INPUT as const,
  controlName,
  label,
  validators: required ? [Validators.required] : [],
});

const baseConfig: FormConfig = {
  errorDictionary: { required: () => 'Fill this in' },
  fields: [
    input('name', 'Name'),
    input('mail', 'Email'),
    input('phone', 'Phone'),
  ],
};

describe('CrisprFormComponent invalid errors snack bar', () => {
  async function createForm(
    showInvalidErrors?: boolean | InvalidErrorsConfig,
    config: FormConfig = baseConfig
  ) {
    const fixture = TestBed.createComponent(CrisprFormComponent);
    fixture.componentRef.setInput('config', {
      ...config,
      ...(showInvalidErrors === undefined ? {} : { showInvalidErrors }),
    });
    await fixture.whenStable();
    return fixture;
  }

  const containers = (): HTMLElement[] =>
    Array.from(document.querySelectorAll('mat-snack-bar-container'));

  const waitFor = async (condition: () => boolean) => {
    for (let i = 0; i < 100 && !condition(); i++) {
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrisprFormComponent],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(OverlayContainer).ngOnDestroy();
  });

  it('opens no snack bar on an invalid submit when the option is absent', async () => {
    const fixture = await createForm();

    fixture.componentInstance.handleSubmit();
    await fixture.whenStable();

    expect(containers()).toHaveLength(0);
  });

  it('opens no snack bar on an invalid submit when the option is false', async () => {
    const fixture = await createForm(false);

    fixture.componentInstance.handleSubmit();
    await fixture.whenStable();

    expect(containers()).toHaveLength(0);
  });

  it('opens one snack bar listing each invalid field with its message, in config order', async () => {
    const fixture = await createForm(true);

    fixture.componentInstance.handleSubmit();
    await fixture.whenStable();

    expect(containers()).toHaveLength(1);
    const items = Array.from(containers()[0].querySelectorAll('li')).map((li) =>
      li.textContent.replace(/\s+/g, ' ').trim()
    );
    expect(items).toEqual([
      'Name: Fill this in',
      'Email: Fill this in',
      'Phone: Fill this in',
    ]);
  });

  it('opens the snack bar for a submit through the hidden trigger button', async () => {
    const fixture = await createForm(true);

    fixture.componentInstance.triggerSubmit();
    await fixture.whenStable();

    expect(containers()).toHaveLength(1);
  });

  it('opens no snack bar on a valid submit', async () => {
    const fixture = await createForm(true);
    fixture.componentInstance
      .form()
      .patchValue({ name: 'Ada', mail: 'ada@example.com', phone: '1' });

    fixture.componentInstance.handleSubmit();
    await fixture.whenStable();

    expect(containers()).toHaveLength(0);
  });

  it('lists up to maxErrors fields and sums up the rest as "+N more"', async () => {
    const fixture = await createForm({ maxErrors: 2 });

    fixture.componentInstance.handleSubmit();
    await fixture.whenStable();

    const container = containers()[0];
    expect(Array.from(container.querySelectorAll('li'))).toHaveLength(2);
    expect(container.textContent).toContain('+1 more');
    expect(container.textContent).not.toContain('Phone');
  });

  it('lists five fields by default and sums up the rest', async () => {
    const fields = Array.from({ length: 7 }, (_, i) =>
      input(`field${i}`, `Field ${i}`)
    );
    const fixture = await createForm(true, { fields });

    fixture.componentInstance.handleSubmit();
    await fixture.whenStable();

    const container = containers()[0];
    expect(Array.from(container.querySelectorAll('li'))).toHaveLength(5);
    expect(container.textContent).toContain('+2 more');
  });

  it('shows no "+N more" when everything fits', async () => {
    const fixture = await createForm(true);

    fixture.componentInstance.handleSubmit();
    await fixture.whenStable();

    expect(containers()[0].textContent).not.toContain('more');
  });

  it('shows the heading in the plural for several fields', async () => {
    const fixture = await createForm(true);

    fixture.componentInstance.handleSubmit();
    await fixture.whenStable();

    expect(containers()[0].textContent).toContain('Fix 3 fields to continue');
  });

  it('shows the heading in the singular for one field', async () => {
    const fixture = await createForm(true, { fields: [input('name', 'Name')] });

    fixture.componentInstance.handleSubmit();
    await fixture.whenStable();

    expect(containers()[0].textContent).toContain('Fix 1 field to continue');
  });

  it('uses the library default messages when the config has no errorDictionary', async () => {
    const fixture = await createForm(true, {
      fields: [input('name', 'Name')],
    });

    fixture.componentInstance.handleSubmit();
    await fixture.whenStable();

    expect(containers()[0].textContent).toContain('This field is required');
  });

  it('opens the snack bar for 8 seconds by default', async () => {
    const open = jest.spyOn(TestBed.inject(MatSnackBar), 'openFromComponent');
    const fixture = await createForm(true);

    fixture.componentInstance.handleSubmit();

    expect(open).toHaveBeenCalledTimes(1);
    expect(open.mock.calls[0][0]).toBe(InvalidFieldsSnackBarComponent);
    expect(open.mock.calls[0][1].duration).toBe(8000);
    expect(open.mock.calls[0][1].data).toMatchObject({
      maxErrors: 5,
      dismissLabel: 'Dismiss',
    });
  });

  it('applies the duration from the config, including 0 to keep it open', async () => {
    const open = jest.spyOn(TestBed.inject(MatSnackBar), 'openFromComponent');

    const timed = await createForm({ duration: 3000 });
    timed.componentInstance.handleSubmit();
    const kept = await createForm({ duration: 0 });
    kept.componentInstance.handleSubmit();

    expect(open.mock.calls.map(([, config]) => config.duration)).toEqual([
      3000, 0,
    ]);
  });

  it('labels the dismiss button with dismissLabel', async () => {
    const fixture = await createForm({ dismissLabel: 'Got it' });

    fixture.componentInstance.handleSubmit();
    await fixture.whenStable();

    expect(containers()[0].querySelector('button').textContent.trim()).toBe(
      'Got it'
    );
  });

  it('leaves one snack bar after two invalid submits in a row', async () => {
    const fixture = await createForm(true);

    fixture.componentInstance.handleSubmit();
    fixture.componentInstance.handleSubmit();
    await waitFor(() => containers().length === 1);

    expect(containers()).toHaveLength(1);
  });

  it('closes the snack bar when the dismiss button is clicked', async () => {
    const fixture = await createForm(true);
    fixture.componentInstance.handleSubmit();
    await fixture.whenStable();
    expect(containers()).toHaveLength(1);

    containers()[0].querySelector('button').click();
    await waitFor(() => containers().length === 0);

    expect(containers()).toHaveLength(0);
  });

  it('does not move focus into the snack bar', async () => {
    const fixture = await createForm(true);
    const before = document.activeElement;

    fixture.componentInstance.handleSubmit();
    await fixture.whenStable();

    expect(containers()).toHaveLength(1);
    expect(containers()[0].contains(document.activeElement)).toBe(false);
    expect(document.activeElement).toBe(before);
  });

  it('still emits submitted and invalidSubmit with the option off', async () => {
    const fixture = await createForm(false);
    const submitted = jest.fn();
    const invalidSubmit = jest.fn();
    fixture.componentInstance.submitted.subscribe(submitted);
    fixture.componentInstance.invalidSubmit.subscribe(invalidSubmit);

    fixture.componentInstance.handleSubmit();

    expect(submitted).toHaveBeenCalledTimes(1);
    expect(invalidSubmit).toHaveBeenCalledTimes(1);
  });
});
