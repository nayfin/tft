import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBoxDemoComponent } from './search-box-demo.component';

describe('SearchBoxDemoComponent', () => {
  let component: SearchBoxDemoComponent;
  let fixture: ComponentFixture<SearchBoxDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBoxDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
