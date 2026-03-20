import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import type { AnyFieldConfig } from './crispr-field.config';
import type { SelectOption } from './select-field.config';

export interface CreateChipConfig {
  /** Label for the "Create New" option in the autocomplete dropdown. Defaults to '+ Create New' */
  createLabel?: string;
  /** Field configs rendered inside the create form overlay */
  fields: AnyFieldConfig[];
  /** Called when the user submits the create form. Should return the new chip as a SelectOption. */
  submitChip: (group: FormGroup) => Observable<SelectOption>;
  /** Label for the submit button. Defaults to 'Add' */
  submitLabel?: string;
}
