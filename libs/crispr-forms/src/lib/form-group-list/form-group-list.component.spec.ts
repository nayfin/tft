import { Component, input } from '@angular/core';
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

@Component({
  selector: 'crispr-test-display-item',
  template: `{{ value()?.name }}`,
})
class TestDisplayItemComponent {
  value = input<{ name: string } | null>();
  index?: number;
}

describe('FormGroupListComponent with a displayItemComponent', () => {
  let component: FormGroupListComponent;
  let fixture: ComponentFixture<FormGroupListComponent>;

  const config: FormGroupListConfig = {
    controlName: 'items',
    controlType: ControlType.GROUP_LIST,
    minListLength: 0,
    displayItemComponent: TestDisplayItemComponent,
    itemConfig: {
      controlName: 'item',
      controlType: ControlType.SUB_GROUP,
      fields: [
        { controlName: 'name', controlType: ControlType.INPUT, label: 'Name' },
      ],
    },
  };

  /** The labels of the items that are open for editing, e.g. ['Item 3'] */
  function openItems(): string[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('.item-header .mat-h2')
    ).map((el) => (el as HTMLElement).textContent?.trim() ?? '');
  }

  function displayedItems(): number {
    return fixture.nativeElement.querySelectorAll('.display-field-container')
      .length;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGroupListComponent],
    }).compileComponents();

    const group = buildFormGroupFromConfig({ fields: [config] });
    fixture = TestBed.createComponent(FormGroupListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    fixture.componentRef.setInput('value', [
      { name: 'a' },
      { name: 'b' },
      { name: 'c' },
    ]);
    await fixture.whenStable();
  });

  it('should open only the last item for editing when nothing is selected', () => {
    expect(component.selectedIndex()).toBeNull();
    expect(openItems()).toEqual(['Item 3']);
    expect(displayedItems()).toBe(2);
  });

  it('should open only the selected item, not the last one as well', async () => {
    component.clickEditItem(1);
    await fixture.whenStable();

    expect(openItems()).toEqual(['Item 2']);
    expect(displayedItems()).toBe(2);
  });

  it('should open the last item when it is the selected one', async () => {
    component.clickEditItem(2);
    await fixture.whenStable();

    expect(openItems()).toEqual(['Item 3']);
    expect(displayedItems()).toBe(2);
  });

  it('should open the new item and clear the selection when an item is added', async () => {
    component.clickEditItem(0);
    await fixture.whenStable();

    component.clickAdd();
    await fixture.whenStable();

    expect(component.selectedIndex()).toBeNull();
    expect(openItems()).toEqual(['Item 4']);
    expect(displayedItems()).toBe(3);
  });

  it('should clear the selection when the selected item is deleted', () => {
    component.clickEditItem(1);

    component.clickDelete(1);

    expect(component.selectedIndex()).toBeNull();
  });

  it('should move the selection down when an item before it is deleted', async () => {
    component.clickEditItem(2);

    component.clickDelete(0);
    await fixture.whenStable();

    expect(component.selectedIndex()).toBe(1);
    expect(openItems()).toEqual(['Item 2']);
  });

  it('should keep the selection when an item after it is deleted', () => {
    component.clickEditItem(0);

    component.clickDelete(2);

    expect(component.selectedIndex()).toBe(0);
  });

  it('should leave the selection alone when nothing is selected', () => {
    component.clickDelete(0);

    expect(component.selectedIndex()).toBeNull();
  });
});
