import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { AutocompleteFieldConfig, ControlType } from '../../utils';
import { AutocompleteFieldComponent } from './autocomplete-field.component';

describe('AutocompleteFieldComponent', () => {
  let component: AutocompleteFieldComponent;
  let fixture: ComponentFixture<AutocompleteFieldComponent>;
  let group: FormGroup;

  const config: AutocompleteFieldConfig = {
    controlName: 'field',
    controlType: ControlType.AUTOCOMPLETE,
    label: 'Fruit',
    options: () => [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteFieldComponent],
    }).compileComponents();

    group = new FormGroup({ field: new FormControl('') });
    fixture = TestBed.createComponent(AutocompleteFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    expect(fixture.nativeElement.textContent).toContain('Fruit');
  });
});
