import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { FileUploadFieldConfig, ControlType } from '../../utils';
import { FileUploadFieldComponent } from './file-upload-field.component';

describe('FileUploadFieldComponent', () => {
  let component: FileUploadFieldComponent;
  let fixture: ComponentFixture<FileUploadFieldComponent>;
  let group: FormGroup;

  const config: FileUploadFieldConfig = {
    controlName: 'field',
    controlType: ControlType.FILE_UPLOAD,
    label: 'Documents',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadFieldComponent],
    }).compileComponents();

    group = new FormGroup({ field: new FormControl(null) });
    fixture = TestBed.createComponent(FileUploadFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    expect(fixture.nativeElement.textContent).toContain('Documents');
  });
});
