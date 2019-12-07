import { Component, OnInit, Input } from '@angular/core';
import { Info } from '../../models';

@Component({
  selector: 'crispr-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  @Input() info: Info;
  constructor() { }

  ngOnInit() {
  }

}
