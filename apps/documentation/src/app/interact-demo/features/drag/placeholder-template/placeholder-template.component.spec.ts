import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceholderTemplateComponent } from './placeholder-template.component';

describe('PlaceholderTemplateComponent', () => {
  let component: PlaceholderTemplateComponent;
  let fixture: ComponentFixture<PlaceholderTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceholderTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceholderTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
