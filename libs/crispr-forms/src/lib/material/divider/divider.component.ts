import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'crispr-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss']
})
export class DividerComponent implements OnInit {
  // TODO: pull in type after configs are better organized
  config: {classes: string[]};

  constructor() { }

  ngOnInit() {
  }

}
