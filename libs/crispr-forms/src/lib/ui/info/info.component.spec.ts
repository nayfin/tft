import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoComponent } from './info.component';

describe('InfoComponent', () => {
  let component: InfoComponent;
  let fixture: ComponentFixture<InfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('info', { content: 'Some help' });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the default info icon', () => {
    const icon: HTMLElement = fixture.nativeElement.querySelector('mat-icon');
    expect(icon.textContent?.trim()).toBe('info');
  });

  it('should render a custom icon name', async () => {
    fixture.componentRef.setInput('info', {
      content: 'Some help',
      iconName: 'help',
    });
    await fixture.whenStable();

    const icon: HTMLElement = fixture.nativeElement.querySelector('mat-icon');
    expect(icon.textContent?.trim()).toBe('help');
  });
});
