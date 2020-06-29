import { Component, OnInit, Input } from '@angular/core';
import { SelectOption } from '../../models';

@Component({
  selector: 'crispr-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css']
})
export class OptionComponent implements OnInit {

  @Input() option: SelectOption
  constructor() { }

  ngOnInit(): void {
  }

}
