import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuffixComponent } from './suffix.component';

describe('SuffixComponent', () => {
  let component: SuffixComponent;
  let fixture: ComponentFixture<SuffixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuffixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuffixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
