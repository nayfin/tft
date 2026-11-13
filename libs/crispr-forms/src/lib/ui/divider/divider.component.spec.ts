import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlType } from '../../utils';
import { DividerComponent } from './divider.component';

describe('DividerComponent', () => {
  let component: DividerComponent;
  let fixture: ComponentFixture<DividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DividerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DividerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', {
      controlType: ControlType.DIVIDER,
      classes: ['my-divider'],
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a divider with the configured classes', () => {
    const divider: HTMLElement =
      fixture.nativeElement.querySelector('mat-divider');
    expect(divider).toBeTruthy();
    expect(divider.classList).toContain('my-divider');
  });
});
