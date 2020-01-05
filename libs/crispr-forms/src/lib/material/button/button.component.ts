
import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ButtonConfig } from '../../models';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'crispr-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnInit {

  config: ButtonConfig;
  group: FormGroup;
  formValid$: Observable<boolean>
  get matButtonClass () {
    return this.config.buttonType ? `mat-${this.config.buttonType}-button` : '';
  }

  constructor() { }

  ngOnInit() {
    this.formValid$ = this.group.statusChanges.pipe(
      startWith(this.group.valid ? 'VALID' : 'INVALID'),
      map(status => status === 'VALID')
    );
  }
}