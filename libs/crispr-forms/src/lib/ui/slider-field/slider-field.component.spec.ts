import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { SliderFieldConfig, ControlType } from '../../utils';
import { SliderFieldComponent } from './slider-field.component';

describe('SliderFieldComponent', () => {
  let component: SliderFieldComponent;
  let fixture: ComponentFixture<SliderFieldComponent>;
  let group: FormGroup;

  const config: SliderFieldConfig = {
    controlName: 'field',
    controlType: ControlType.SLIDER,
    label: 'Volume',
    min: 0,
    max: 10,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderFieldComponent],
    }).compileComponents();

    group = new FormGroup({ field: new FormControl(0) });
    fixture = TestBed.createComponent(SliderFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    expect(fixture.nativeElement.textContent).toContain('Volume');
  });
});
