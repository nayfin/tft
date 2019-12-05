
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CrisprFieldConfig } from '../../models';

@Component({
  selector: 'crispr-raised-button',
  templateUrl: './raised-button.component.html',
  styleUrls: ['./raised-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaisedButtonComponent implements OnInit {

  config: CrisprFieldConfig;
  group: FormGroup;

  constructor() { }

  ngOnInit() {
  }
}