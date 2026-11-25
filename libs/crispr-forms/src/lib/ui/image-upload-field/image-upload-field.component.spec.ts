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

  describe('compression timeout', () => {
    const compress = imageCompression as unknown as jest.Mock;
    const tookTooLong =
      'Compressing "photo.png" took too long. Please try again or choose a smaller image.';
    const files = (name = 'photo.png') =>
      ({
        0: new File(['pixels'], name, { type: 'image/png' }),
        length: 1,
      } as unknown as FileList);
    const flushMicrotasks = async () => {
      for (let i = 0; i < 5; i++) await Promise.resolve();
    };

    // the signal of the latest compression and the way to settle it: a compression only settles when the test says so
    let signal: AbortSignal;
    let finish: (file: File) => void;
    let fail: (error: Error) => void;
    let filesChanged: jest.Mock;
    let stateChange: jest.Mock;

    async function setUp(extra: Partial<ImageUploadFieldConfig> = {}) {
      filesChanged = jest.fn();
      stateChange = jest.fn();
      const control = new FormControl(null, [Validators.required]);
      const uploadFixture = TestBed.createComponent(ImageUploadFieldComponent);
      uploadFixture.componentRef.setInput('config', {
        ...config,
        compressImage: true,
        targetCompressedImageFileSizeMb: 0,
        minCompressionThresholdMb: 0,
        validators: [Validators.required],
        filesChanged,
        processingStateChange: stateChange,
        ...extra,
      });
      uploadFixture.componentRef.setInput(
        'group',
        new FormGroup({ field: control })
      );
      await uploadFixture.whenStable();
      fixture = uploadFixture;
      component = uploadFixture.componentInstance;
      // fake timers from here on, so the timeout is driven by the test
      jest.useFakeTimers();
      return control;
    }

    const failedChanges = () =>
      stateChange.mock.calls.filter(([state]) => state === 'failed');

    beforeEach(() => {
      compress.mockReset();
      compress.mockImplementation(
        (_file: File, options: { signal: AbortSignal }) => {
          signal = options.signal;
          return new Promise<File>((resolve, reject) => {
            finish = resolve;
            fail = reject;
          });
        }
      );
    });

    afterEach(() => jest.useRealTimers());

    it('fails after 30 seconds by default, with its own message, the failure error first and the compression aborted', async () => {
      const control = await setUp();
      component.filesChanged(files());

      jest.advanceTimersByTime(29999);
      expect(component.processingState()).toBe('processing');
      expect(signal.aborted).toBe(false);

      jest.advanceTimersByTime(1);
      expect(component.processingState()).toBe('failed');
      expect(component.failureMessage()).toBe(tookTooLong);
      expect(Object.keys(control.errors)).toEqual([
        'imageProcessingFailed',
        'required',
      ]);
      expect(getErrorMessage(control.errors)).toBe(tookTooLong);
      expect(signal.aborted).toBe(true);
      expect(failedChanges()).toHaveLength(1);
      expect(component.progress()).toBeUndefined();
    });

    it('uses compressionTimeoutMs from the config', async () => {
      await setUp({ compressionTimeoutMs: 100 });
      component.filesChanged(files());

      jest.advanceTimersByTime(99);
      expect(component.processingState()).toBe('processing');
      jest.advanceTimersByTime(1);

      expect(component.processingState()).toBe('failed');
      expect(component.failureMessage()).toBe(tookTooLong);
    });

    it('never times out when compressionTimeoutMs is 0', async () => {
      await setUp({ compressionTimeoutMs: 0 });
      component.filesChanged(files());

      jest.advanceTimersByTime(24 * 60 * 60 * 1000);

      expect(component.processingState()).toBe('processing');
      expect(signal.aborted).toBe(false);
      expect(jest.getTimerCount()).toBe(0);
    });

    it('does not fail a compression that finished before the timeout', async () => {
      const control = await setUp();
      component.filesChanged(files());

      finish(new File(['small'], 'photo.png', { type: 'image/png' }));
      await flushMicrotasks();
      // the timeout timer is cleared once the compression is done (a short advance first runs the timers Angular schedules itself)
      jest.advanceTimersByTime(1000);
      expect(jest.getTimerCount()).toBe(0);
      jest.advanceTimersByTime(60000);

      expect(component.processingState()).toBe('idle');
      expect(control.value).toBeInstanceOf(File);
      expect(filesChanged).toHaveBeenCalledTimes(1);
      expect(failedChanges()).toHaveLength(0);
    });

    it('ignores a late result of a compression that timed out', async () => {
      const control = await setUp();
      component.filesChanged(files());
      jest.advanceTimersByTime(30000);

      finish(new File(['small'], 'photo.png', { type: 'image/png' }));
      await flushMicrotasks();

      expect(component.processingState()).toBe('failed');
      expect(control.value).toBeNull();
      expect(filesChanged).not.toHaveBeenCalled();
      expect(stateChange.mock.calls.map(([state]) => state)).toEqual([
        'processing',
        'failed',
      ]);
    });

    it('ignores a late rejection of a compression that timed out', async () => {
      await setUp();
      component.filesChanged(files());
      jest.advanceTimersByTime(30000);

      fail(new Error('aborted'));
      await flushMicrotasks();

      expect(component.processingState()).toBe('failed');
      expect(component.failureMessage()).toBe(tookTooLong);
      expect(failedChanges()).toHaveLength(1);
    });

    it('processes a new selection normally after a timeout', async () => {
      const control = await setUp();
      component.filesChanged(files());
      jest.advanceTimersByTime(30000);
      expect(component.processingState()).toBe('failed');

      component.filesChanged(files('second.png'));
      expect(component.processingState()).toBe('processing');
      expect(Object.keys(control.errors)[0]).toBe('imageProcessing');
      finish(new File(['small'], 'second.png', { type: 'image/png' }));
      await flushMicrotasks();

      expect(component.processingState()).toBe('idle');
      expect(control.value).toBeInstanceOf(File);
      expect(filesChanged).toHaveBeenCalledTimes(1);
      expect(stateChange.mock.calls.map(([state]) => state)).toEqual([
        'processing',
        'failed',
        'processing',
        'idle',
      ]);
    });

    it('cancels the timer when the field is cleared', async () => {
      await setUp();
      component.filesChanged(files());
      jest.advanceTimersByTime(1000);
      expect(jest.getTimerCount()).toBe(1);

      component.clearFileInput();
      jest.advanceTimersByTime(1000);
      expect(jest.getTimerCount()).toBe(0);
      jest.advanceTimersByTime(60000);

      expect(component.processingState()).toBe('idle');
      expect(failedChanges()).toHaveLength(0);
    });

    it('cancels the timer when the field is destroyed', async () => {
      await setUp();
      component.filesChanged(files());
      jest.advanceTimersByTime(1000);
      expect(jest.getTimerCount()).toBe(1);

      fixture.destroy();
      jest.advanceTimersByTime(1000);
      expect(jest.getTimerCount()).toBe(0);
      jest.advanceTimersByTime(60000);

      expect(failedChanges()).toHaveLength(0);
    });

    it('shows the timeout message in the inline error', async () => {
      await setUp();
      component.filesChanged(files());
      jest.advanceTimersByTime(30000);
      // let the change detection Angular scheduled with the fake timers run, then go back to real timers
      jest.advanceTimersByTime(1000);

      jest.useRealTimers();
      await fixture.whenStable();

      expect(
        fixture.nativeElement
          .querySelector('p.tft-control-error')
          ?.textContent.trim()
      ).toBe(tookTooLong);
    });
  });
});
