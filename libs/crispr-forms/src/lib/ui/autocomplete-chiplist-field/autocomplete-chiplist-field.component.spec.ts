import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { AutocompleteChiplistFieldConfig, ControlType } from '../../utils';
import { AutocompleteChiplistFieldComponent } from './autocomplete-chiplist-field.component';

describe('AutocompleteChiplistFieldComponent', () => {
  let component: AutocompleteChiplistFieldComponent;
  let fixture: ComponentFixture<AutocompleteChiplistFieldComponent>;
  let group: FormGroup;

  const config: AutocompleteChiplistFieldConfig = {
    controlName: 'field',
    controlType: ControlType.AUTOCOMPLETE_CHIPLIST,
    label: 'Fruits',
    options: () => [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteChiplistFieldComponent],
    }).compileComponents();

    group = new FormGroup({ field: new FormControl([]) });
    fixture = TestBed.createComponent(AutocompleteChiplistFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    expect(fixture.nativeElement.textContent).toContain('Fruits');
  });
});
