import { Component, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'crispr-selected-file',
  templateUrl: './selected-file.component.html',
  styleUrls: ['./selected-file.component.scss']
})
export class SelectedFileComponent {

  @Input() fileName: string;
  @Input() progress: number;
}
