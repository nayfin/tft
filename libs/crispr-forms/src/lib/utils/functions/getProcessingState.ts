import type { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import type { ImageProcessingState } from '../models';

/**
 * The aggregate processing state of the image upload fields in a form.
 *
 * - `processing` when any image field is processing (compressing) an image
 * - otherwise `failed` when any image field failed to process its image
 * - otherwise `idle`, which is also the answer for a form without image fields
 *
 * The control tree is walked (sub-groups and group list items included), looking for the `imageProcessing` and
 * `imageProcessingFailed` errors that an image field puts on its control. They are found anywhere in a control's
 * errors, not only as the first key. Disabled controls and groups are skipped.
 *
 * Pure: it only reads the controls.
 * @param control the form group (or any control) to look in
 */
export function getProcessingState(control: AbstractControl): ImageProcessingState {
  if (control.disabled) {
    return 'idle';
  }
  let state: ImageProcessingState = 'idle';
  const errors = control.errors;
  if (errors && 'imageProcessing' in errors) {
    return 'processing';
  }
  if (errors && 'imageProcessingFailed' in errors) {
    state = 'failed';
  }
  for (const child of children(control)) {
    const childState = getProcessingState(child);
    if (childState === 'processing') {
      return 'processing';
    }
    if (childState === 'failed') {
      state = 'failed';
    }
  }
  return state;
}

function children(control: AbstractControl): AbstractControl[] {
  if ('controls' in control) {
    const { controls } = control as FormGroup | FormArray;
    return Array.isArray(controls) ? controls : Object.values(controls);
  }
  return [];
}
