import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeadingConfig } from '../../utils';
import { HeadingComponent } from './heading.component';

describe('HeadingComponent', () => {
  let component: HeadingComponent;
  let fixture: ComponentFixture<HeadingComponent>;

  const config: HeadingConfig = { label: 'A heading' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeadingComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label with the default typography class', () => {
    const label: HTMLElement = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('A heading');
    expect(label.classList).toContain('mat-h3');
  });

  it('should use the configured typography class', async () => {
    fixture.componentRef.setInput('config', {
      ...config,
      typographyClass: 'mat-h1',
    });
    await fixture.whenStable();

    const label: HTMLElement = fixture.nativeElement.querySelector('label');
    expect(label.classList).toContain('mat-h1');
  });
});
