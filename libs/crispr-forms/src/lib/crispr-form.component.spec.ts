import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisprFormComponent } from './crispr-form.component';

describe('DynamicFormComponent', () => {
  let component: CrisprFormComponent;
  let fixture: ComponentFixture<CrisprFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrisprFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisprFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
