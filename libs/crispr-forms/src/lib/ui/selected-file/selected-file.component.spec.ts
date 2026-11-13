import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectedFileComponent } from './selected-file.component';

describe('SelectedFileComponent', () => {
  let component: SelectedFileComponent;
  let fixture: ComponentFixture<SelectedFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedFileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectedFileComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('fileName', 'photo.png');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the file name', () => {
    expect(fixture.nativeElement.querySelector('h3').textContent).toContain(
      'photo.png'
    );
  });

  it('should only show the progress bar when showProgress is set', async () => {
    expect(fixture.nativeElement.querySelector('mat-progress-bar')).toBeNull();

    fixture.componentRef.setInput('showProgress', true);
    fixture.componentRef.setInput('progress', 40);
    await fixture.whenStable();

    expect(
      fixture.nativeElement.querySelector('mat-progress-bar')
    ).toBeTruthy();
  });
});
