import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { getErrorMessage } from '@tft/form-validation-handler';
import imageCompression from 'browser-image-compression';
import { ImageUploadFieldConfig, ControlType } from '../../utils';
import { ImageUploadFieldComponent } from './image-upload-field.component';

// the real library needs canvas and workers, tests control when (and how) a compression finishes instead
jest.mock('browser-image-compression', () => {
  const compress = jest.fn();
  return {
    __esModule: true,
    default: Object.assign(compress, {
      getDataUrlFromFile: jest.fn(async () => 'data:image/png;base64,AA'),
    }),
  };
});

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

  describe('processing error order', () => {
    const compressionConfig: ImageUploadFieldConfig = {
      ...config,
      compressImage: true,
      // any file is bigger than these, so every selection is compressed
      targetCompressedImageFileSizeMb: 0,
      minCompressionThresholdMb: 0,
    };
    const compress = imageCompression as unknown as jest.Mock;
    const flush = async () => {
      await fixture.whenStable();
      await new Promise((resolve) => setTimeout(resolve, 0));
      await fixture.whenStable();
    };
    const keys = (errors: ValidationErrors | null) => Object.keys(errors ?? {});
    const files = () =>
      ({
        0: new File(['pixels'], 'photo.png', { type: 'image/png' }),
        length: 1,
      } as unknown as FileList);

    /** Compresses the way the component asks, but only finishes when the test says so. */
    let finish: (file: File) => void;
    let fail: (error: Error) => void;

    async function setUp(validators = [Validators.required]) {
      const control = new FormControl(null, validators);
      const uploadGroup = new FormGroup({ field: control });
      const uploadFixture = TestBed.createComponent(ImageUploadFieldComponent);
      uploadFixture.componentRef.setInput('config', {
        ...compressionConfig,
        validators,
      });
      uploadFixture.componentRef.setInput('group', uploadGroup);
      await uploadFixture.whenStable();
      fixture = uploadFixture;
      component = uploadFixture.componentInstance;
      return control;
    }

    const errorText = () =>
      (
        fixture.nativeElement.querySelector('p.tft-control-error')
          ?.textContent ?? ''
      ).trim();

    beforeEach(() => {
      compress.mockReset();
      compress.mockImplementation(
        () =>
          new Promise<File>((resolve, reject) => {
            finish = resolve;
            fail = reject;
          })
      );
    });

    it('lists the processing error before required while compressing', async () => {
      const control = await setUp();

      component.filesChanged(files());

      expect(keys(control.errors)).toEqual(['imageProcessing', 'required']);
      expect(getErrorMessage(control.errors)).toBe(
        'Please wait while the image is processed'
      );
    });

    it('lists the failure before required after a compression fails', async () => {
      const control = await setUp();
      component.filesChanged(files());

      fail(new Error('boom'));
      await flush();

      expect(keys(control.errors)).toEqual([
        'imageProcessingFailed',
        'required',
      ]);
      expect(getErrorMessage(control.errors)).toBe(
        'Unable to process "photo.png". Please try a different image.'
      );
    });

    it('shows the processing message, not the required message, while compressing', async () => {
      await setUp();

      component.filesChanged(files());
      await flush();

      expect(errorText()).toBe('Please wait while the image is processed');
    });

    it('shows the failure message, not the required message, after a failure', async () => {
      await setUp();
      component.filesChanged(files());

      fail(new Error('boom'));
      await flush();

      expect(errorText()).toBe(
        'Unable to process "photo.png". Please try a different image.'
      );
    });

    it('goes back to the required error when the field is cleared', async () => {
      const control = await setUp();
      component.filesChanged(files());
      expect(keys(control.errors)).toContain('imageProcessing');

      component.clearFileInput();

      expect(keys(control.errors)).toEqual(['required']);
    });

    it('has no error once a compression succeeds', async () => {
      const control = await setUp();
      component.filesChanged(files());

      finish(new File(['small'], 'photo.png', { type: 'image/png' }));
      await flush();

      expect(control.errors).toBeNull();
    });

    it('keeps the other validators of the config after the processing error', async () => {
      const custom = () => ({ custom: true });
      const control = await setUp([Validators.required, custom]);

      component.filesChanged(files());

      expect(keys(control.errors)).toEqual([
        'imageProcessing',
        'required',
        'custom',
      ]);
      expect(control.hasValidator(Validators.required)).toBe(true);
      expect(control.hasValidator(custom)).toBe(true);
    });

    it('still reports Validators.required on the control once the field is set up, so Material marks it required', async () => {
      const control = await setUp();

      expect(control.hasValidator(Validators.required)).toBe(true);
      component.filesChanged(files());
      expect(control.hasValidator(Validators.required)).toBe(true);
    });

    it('removes the processing validator when the field is destroyed, and required still applies', async () => {
      const control = await setUp();
      component.filesChanged(files());

      fixture.destroy();
      // a leftover processing state must no longer make the control invalid
      component.processingState.set('failed');
      control.updateValueAndValidity();

      expect(keys(control.errors)).toEqual(['required']);
      expect(control.hasValidator(Validators.required)).toBe(true);
    });
  });
});
