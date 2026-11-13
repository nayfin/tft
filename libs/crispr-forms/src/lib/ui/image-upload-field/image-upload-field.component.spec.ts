import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ImageUploadFieldConfig, ControlType } from '../../utils';
import { ImageUploadFieldComponent } from './image-upload-field.component';

describe('ImageUploadFieldComponent', () => {
  let component: ImageUploadFieldComponent;
  let fixture: ComponentFixture<ImageUploadFieldComponent>;
  let group: FormGroup;

  const config: ImageUploadFieldConfig = {
    controlName: 'field',
    controlType: ControlType.IMAGE_UPLOAD,
    label: 'Avatar',
    acceptedTypes: 'image/*',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageUploadFieldComponent],
    }).compileComponents();

    group = new FormGroup({ field: new FormControl(null) });
    fixture = TestBed.createComponent(ImageUploadFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    expect(fixture.nativeElement.textContent).toContain('Avatar');
  });
});
