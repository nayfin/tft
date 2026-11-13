import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup } from '@angular/forms';
import {
  buildFormGroupFromConfig,
  ControlType,
  FormGroupListConfig,
} from '../utils';
import { FormGroupListComponent } from './form-group-list.component';

describe('FormGroupListComponent', () => {
  let component: FormGroupListComponent;
  let fixture: ComponentFixture<FormGroupListComponent>;
  let group: FormGroup;

  const config: FormGroupListConfig = {
    controlName: 'items',
    controlType: ControlType.GROUP_LIST,
    displayInitialItem: true,
    itemConfig: {
      controlName: 'item',
      controlType: ControlType.SUB_GROUP,
      fields: [
        { controlName: 'name', controlType: ControlType.INPUT, label: 'Name' },
      ],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGroupListComponent],
    }).compileComponents();

    group = buildFormGroupFromConfig({ fields: [config] });
    fixture = TestBed.createComponent(FormGroupListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add an add button with the default label', () => {
    const add: HTMLButtonElement = fixture.nativeElement.querySelector('.add');
    expect(add.textContent).toContain('ADD ITEM');
  });

  it('should add an item to the list when the add button is clicked', async () => {
    const items = group.get('items') as FormArray;
    const before = items.length;

    fixture.nativeElement.querySelector('.add').click();
    await fixture.whenStable();

    expect(items.length).toBe(before + 1);
  });
});
