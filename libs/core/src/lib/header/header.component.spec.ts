import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the default title and the subtitle', async () => {
    fixture.componentRef.setInput('subtitle', 'A subtitle');
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('strong')?.textContent).toContain(
      'Tortilla Flat Tech'
    );
    expect(element.querySelector('.sub-title')?.textContent).toBe('A subtitle');
  });

  it('should emit menuClicked when the menu button is clicked', () => {
    const emitted = jest.fn();
    component.menuClicked.subscribe(emitted);

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    button.click();

    expect(emitted).toHaveBeenCalledTimes(1);
  });
});
