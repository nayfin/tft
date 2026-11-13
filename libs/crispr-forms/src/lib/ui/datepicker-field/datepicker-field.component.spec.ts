import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { DatepickerFieldConfig, ControlType } from '../../utils';
import { DatepickerFieldComponent } from './datepicker-field.component';

describe('DatepickerFieldComponent', () => {
  let component: DatepickerFieldComponent;
  let fixture: ComponentFixture<DatepickerFieldComponent>;
  let group: FormGroup;

  const config: DatepickerFieldConfig = {
    controlName: 'field',
    controlType: ControlType.DATEPICKER,
    label: 'Birthday',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerFieldComponent],
    }).compileComponents();

    group = new FormGroup({ field: new FormControl(null) });
    fixture = TestBed.createComponent(DatepickerFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    expect(fixture.nativeElement.textContent).toContain('Birthday');
  });
});
