
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ButtonConfig } from '../../models';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CrisprFieldComponent } from '../../abstracts';

@Component({
  selector: 'crispr-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent extends CrisprFieldComponent<ButtonConfig> implements OnInit {

  group: FormGroup;
  defaultConfig: Partial<ButtonConfig> = {buttonType: 'raised', type: 'submit'};
  formValid$: Observable<boolean>

  get matButtonClass () {
    return this.config.buttonType ? `mat-${this.config.buttonType}-button` : '';
  }

  ngOnInit() {
    super.ngOnInit();
    this.formValid$ = this.group.statusChanges.pipe(
      map(status => status === 'VALID'),
      startWith(this.group.valid),
    );
  }

  handleClick(group: FormGroup, event: MouseEvent) {
    if (this.config.callback) {
      this.config.callback(group, event);
    }
  }
}
