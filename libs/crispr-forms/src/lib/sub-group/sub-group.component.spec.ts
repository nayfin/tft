import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubGroupComponent } from './sub-group.component';

describe('SubGroupComponent', () => {
  let component: SubGroupComponent;
  let fixture: ComponentFixture<SubGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
