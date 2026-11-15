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
});
