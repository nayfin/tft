import { Component, OnInit, Input } from '@angular/core';
import { HeadingConfig } from '../../models';

@Component({
  selector: 'crispr-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
export class HeadingComponent implements OnInit {
  @Input() config: HeadingConfig;

  constructor() { }

  ngOnInit() {
  }

}
