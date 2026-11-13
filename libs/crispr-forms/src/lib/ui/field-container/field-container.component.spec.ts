import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { ControlType, CrisprControlConfig } from '../../utils';
import { FieldContainerComponent } from './field-container.component';

describe('FieldContainerComponent', () => {
  let component: FieldContainerComponent;
  let fixture: ComponentFixture<FieldContainerComponent>;
  let group: FormGroup;

  const config: CrisprControlConfig = {
    controlName: 'field',
    controlType: ControlType.INPUT,
  };

  async function init(fieldConfig: CrisprControlConfig) {
    fixture = TestBed.createComponent(FieldContainerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', fieldConfig);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldContainerComponent],
    }).compileComponents();

    group = new FormGroup({ field: new FormControl('') });
  });

  it('should create', async () => {
    await init(config);

    expect(component).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('.field-container')
    ).toBeTruthy();
  });

  it('should disable the control when disabledCallback emits true', async () => {
    await init({ ...config, disabledCallback: () => of(true) });

    expect(group.get('field').disabled).toBe(true);
  });

  it('should hide the field when it is disabled and hideDisabled is set', async () => {
    await init({
      ...config,
      hideDisabled: true,
      disabledCallback: () => of(true),
    });

    expect(fixture.nativeElement.style.display).toBe('none');
    expect(fixture.nativeElement.querySelector('.field-container')).toBeNull();
  });

  it('should set the control to the computed value', async () => {
    await init({ ...config, computeValue: () => of('computed') });

    expect(group.get('field').value).toBe('computed');
  });
});
