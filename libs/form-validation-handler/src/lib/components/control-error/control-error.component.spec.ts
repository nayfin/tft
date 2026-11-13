import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlErrorComponent } from './control-error.component';

describe('ControlErrorComponent', () => {
  let component: ControlErrorComponent;
  let fixture: ComponentFixture<ControlErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlErrorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be hidden until there is a message', () => {
    expect(component.hide()).toBe(true);

    fixture.componentRef.setInput('text', 'Required');

    expect(component.hide()).toBe(false);
  });

  it('should render the message in a paragraph', async () => {
    fixture.componentRef.setInput('text', 'Required');
    await fixture.whenStable();

    const paragraph: HTMLElement | null = fixture.nativeElement.querySelector(
      'p.tft-control-error'
    );
    expect(paragraph?.textContent).toBe('Required');
  });

  it('should hide again when the message is cleared', () => {
    fixture.componentRef.setInput('text', 'Required');
    fixture.componentRef.setInput('text', null);

    expect(component.hide()).toBe(true);
  });
});
