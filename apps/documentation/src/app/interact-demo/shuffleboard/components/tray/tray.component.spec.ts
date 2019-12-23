import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrayComponent } from './tray.component';

describe('TrayComponent', () => {
  let component: TrayComponent;
  let fixture: ComponentFixture<TrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
