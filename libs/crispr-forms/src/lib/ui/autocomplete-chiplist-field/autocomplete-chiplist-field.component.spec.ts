import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteChiplistFieldComponent } from './autocomplete-chiplist-field.component';

describe('AutocompleteChiplistFieldComponent', () => {
  let component: AutocompleteChiplistFieldComponent;
  let fixture: ComponentFixture<AutocompleteChiplistFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteChiplistFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteChiplistFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
