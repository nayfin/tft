import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'crispr-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss']
})
export class DividerComponent implements OnInit {

  config: {classes: string[]};

  constructor() { }

  ngOnInit() {
  }

}
