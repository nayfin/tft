import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import {
  buildFormGroupFromConfig,
  ControlType,
  SubGroupConfig,
} from '../utils';
import { SubGroupComponent } from './sub-group.component';

describe('SubGroupComponent', () => {
  let component: SubGroupComponent;
  let fixture: ComponentFixture<SubGroupComponent>;
  let group: FormGroup;

  const config: SubGroupConfig = {
    controlName: 'address',
    controlType: ControlType.SUB_GROUP,
    fields: [
      {
        controlName: 'street',
        controlType: ControlType.INPUT,
        label: 'Street',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubGroupComponent],
    }).compileComponents();

    group = buildFormGroupFromConfig({ fields: [config] });
    fixture = TestBed.createComponent(SubGroupComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a field for each field in the sub group config', () => {
    expect(
      fixture.nativeElement.querySelectorAll('crispr-input-field').length
    ).toBe(1);
  });

  it('should nest the sub group fields under the sub group control', () => {
    expect(group.get('address.street')).toBeTruthy();
  });
});
