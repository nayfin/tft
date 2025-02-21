import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import {
  SubGroupConfig,
} from '../utils';
import { CrisprControlComponent } from '../utils/abstracts/crispr-control.abstract';


@Component({
  selector: 'crispr-sub-group',
  templateUrl: './sub-group.component.html',
  styleUrls: ['./sub-group.component.scss'],
  // TODO: child image upload controls aren't getting updated appropriately when in OnPush strategy.
  // We can add cdr to this class, but everything that extends it will need the cdr attached
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubGroupComponent extends CrisprControlComponent<SubGroupConfig> implements OnInit {
  
  ngOnInit() {
    super.ngOnInit();
  }
}
