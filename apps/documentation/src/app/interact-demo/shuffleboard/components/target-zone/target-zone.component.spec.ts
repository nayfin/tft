import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetZoneComponent } from './target-zone.component';

describe('TargetZoneComponent', () => {
  let component: TargetZoneComponent;
  let fixture: ComponentFixture<TargetZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
