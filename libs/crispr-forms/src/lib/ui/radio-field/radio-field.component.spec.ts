import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { RadioFieldConfig, ControlType } from '../../utils';
import { RadioFieldComponent } from './radio-field.component';

describe('RadioFieldComponent', () => {
  let component: RadioFieldComponent;
  let fixture: ComponentFixture<RadioFieldComponent>;
  let group: FormGroup;

  const config: RadioFieldConfig = {
    controlName: 'field',
    controlType: ControlType.RADIO,
    options: [
      { label: 'Red', value: 'red' },
      { label: 'Blue', value: 'blue' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioFieldComponent],
    }).compileComponents();

    group = new FormGroup({ field: new FormControl('') });
    fixture = TestBed.createComponent(RadioFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a radio button for each option', () => {
    expect(
      fixture.nativeElement.querySelectorAll('mat-radio-button').length
    ).toBe(2);
  });

  describe('accessible name', () => {
    async function render(extra: Partial<RadioFieldConfig>, name = 'field') {
      const radioFixture = TestBed.createComponent(RadioFieldComponent);
      radioFixture.componentRef.setInput('config', {
        ...config,
        controlName: name,
        ...extra,
      });
      radioFixture.componentRef.setInput(
        'group',
        new FormGroup({ [name]: new FormControl('') })
      );
      await radioFixture.whenStable();
      return radioFixture;
    }

    const radioGroup = (f: ComponentFixture<RadioFieldComponent>) =>
      f.nativeElement.querySelector('mat-radio-group') as HTMLElement;
    const visibleLabel = (f: ComponentFixture<RadioFieldComponent>) =>
      f.nativeElement.querySelector('.radio-label') as HTMLElement | null;

    it('renders the label visibly and points the group at it with aria-labelledby', async () => {
      const labelled = await render({ label: 'Favourite colour' });

      const label = visibleLabel(labelled);
      expect(label.textContent.trim()).toBe('Favourite colour');
      expect(label.id).toBeTruthy();
      expect(radioGroup(labelled).getAttribute('aria-labelledby')).toBe(
        label.id
      );
      expect(radioGroup(labelled).hasAttribute('aria-label')).toBe(false);
    });

    it('names the group with its heading label when there is no label', async () => {
      const headed = await render({ heading: { label: 'Pick a colour' } });

      expect(radioGroup(headed).getAttribute('aria-label')).toBe(
        'Pick a colour'
      );
      expect(radioGroup(headed).hasAttribute('aria-labelledby')).toBe(false);
      expect(visibleLabel(headed)).toBeNull();
    });

    it('prefers the label over the heading for the accessible name and still shows the heading', async () => {
      const both = await render({
        label: 'Favourite colour',
        heading: { label: 'Colours' },
      });

      expect(radioGroup(both).getAttribute('aria-labelledby')).toBe(
        visibleLabel(both).id
      );
      expect(radioGroup(both).hasAttribute('aria-label')).toBe(false);
      expect(both.nativeElement.querySelector('crispr-heading')).toBeTruthy();
    });

    it('sets no name attributes when there is neither a label nor a heading', async () => {
      const bare = await render({});

      expect(radioGroup(bare).hasAttribute('aria-label')).toBe(false);
      expect(radioGroup(bare).hasAttribute('aria-labelledby')).toBe(false);
      expect(visibleLabel(bare)).toBeNull();
    });

    it('gives the labels of two radios different ids', async () => {
      const first = await render({ label: 'First' }, 'first');
      const second = await render({ label: 'Second' }, 'second');

      expect(visibleLabel(first).id).not.toBe(visibleLabel(second).id);
      expect(radioGroup(first).getAttribute('aria-labelledby')).toBe(
        visibleLabel(first).id
      );
      expect(radioGroup(second).getAttribute('aria-labelledby')).toBe(
        visibleLabel(second).id
      );
    });
  });
});
