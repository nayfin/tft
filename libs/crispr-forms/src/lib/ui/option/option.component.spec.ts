import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionComponent } from './option.component';

describe('OptionComponent', () => {
  let component: OptionComponent;
  let fixture: ComponentFixture<OptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OptionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('option', { label: 'Option A', value: 'a' });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the option label', () => {
    expect(fixture.nativeElement.textContent).toContain('Option A');
  });

  it('should render an image only when the option has an imageUrl', async () => {
    expect(fixture.nativeElement.querySelector('img')).toBeNull();

    fixture.componentRef.setInput('option', {
      label: 'Option A',
      value: 'a',
      imageUrl: 'a.png',
    });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('img')).toBeTruthy();
  });
});
