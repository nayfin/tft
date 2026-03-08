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
    standalone: false
})
export class SubGroupComponent extends CrisprControlComponent<SubGroupConfig> implements OnInit {
  
  ngOnInit() {
    super.ngOnInit();
  }
}
