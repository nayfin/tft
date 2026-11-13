import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterChiplistDemoComponent } from './filter-chiplist-demo.component';

describe('FilterChiplistDemoComponent', () => {
  let component: FilterChiplistDemoComponent;
  let fixture: ComponentFixture<FilterChiplistDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [FilterChiplistDemoComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterChiplistDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
