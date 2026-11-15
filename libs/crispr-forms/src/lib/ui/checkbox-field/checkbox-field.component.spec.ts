import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { CheckboxFieldConfig, ControlType } from '../../utils';
import { CheckboxFieldComponent } from './checkbox-field.component';

describe('CheckboxFieldComponent', () => {
  let component: CheckboxFieldComponent;
  let fixture: ComponentFixture<CheckboxFieldComponent>;
  let group: FormGroup;

  const config: CheckboxFieldConfig = {
    controlName: 'field',
    controlType: ControlType.CHECKBOX,
    label: 'Accept',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxFieldComponent],
    }).compileComponents();

    group = new FormGroup({ field: new FormControl(false) });
    fixture = TestBed.createComponent(CheckboxFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    expect(fixture.nativeElement.textContent).toContain('Accept');
  });
});
