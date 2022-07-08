import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadFieldComponent } from './file-upload-field.component';

describe('FileUploadComponent', () => {
  let component: FileUploadFieldComponent;
  let fixture: ComponentFixture<FileUploadFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUploadFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
