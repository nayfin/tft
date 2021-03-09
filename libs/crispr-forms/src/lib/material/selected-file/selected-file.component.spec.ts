import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedFileComponent } from './selected-file.component';

describe('SelectedFileComponent', () => {
  let component: SelectedFileComponent;
  let fixture: ComponentFixture<SelectedFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
