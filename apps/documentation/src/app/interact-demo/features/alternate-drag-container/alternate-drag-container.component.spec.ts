import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternateDragContainerComponent } from './alternate-drag-container.component';

describe('AlternateDragContainerComponent', () => {
  let component: AlternateDragContainerComponent;
  let fixture: ComponentFixture<AlternateDragContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlternateDragContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternateDragContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
