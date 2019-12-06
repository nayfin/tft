import { Component, OnInit } from '@angular/core';
import { CrisprFieldConfig } from '../../models';

@Component({
  selector: 'crispr-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
export class HeadingComponent implements OnInit {
  config: CrisprFieldConfig;

  constructor() { }

  ngOnInit() {
  }

}
