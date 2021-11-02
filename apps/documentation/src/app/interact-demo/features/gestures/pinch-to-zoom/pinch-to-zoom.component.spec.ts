import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinchToZoomComponent } from './pinch-to-zoom.component';

describe('PinchToZoomComponent', () => {
  let component: PinchToZoomComponent;
  let fixture: ComponentFixture<PinchToZoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PinchToZoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PinchToZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
