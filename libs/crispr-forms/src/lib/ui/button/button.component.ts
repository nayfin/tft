import { Component, OnInit, ChangeDetectionStrategy, Input, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CrisprFieldComponent, ButtonConfig, ControlValue } from '../../utils';

@Component({
  selector: 'crispr-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormValidationHandlerModule,
  ],
})
export class ButtonComponent
  extends CrisprFieldComponent<ButtonConfig>
  implements OnInit
{
  defaultConfig: Partial<ButtonConfig> = {
    buttonType: 'raised',
    type: 'submit',
  };
  formValid$: Observable<boolean>;

  group = signal<FormGroup>(null);
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({alias: 'group'})
  set inputGroup(group: ControlValue) {
    this.group.set(group);
  }
  get matButtonClass() {
    return this.config().buttonType ? `mat-${this.config().buttonType}-button` : '';
  }

  ngOnInit() {
    this.formValid$ = this.group().statusChanges.pipe(
      map((status) => status === 'VALID'),
      startWith(this.group().valid)
    );
  }

  handleClick(group: FormGroup, event: MouseEvent) {
    if (this.config().callback) {
      this.config().callback(group, event);
    }
  }
}
