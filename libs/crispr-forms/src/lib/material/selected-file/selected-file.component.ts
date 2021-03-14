import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'crispr-selected-file',
  templateUrl: './selected-file.component.html',
  styleUrls: ['./selected-file.component.scss']
})
export class SelectedFileComponent {

  @Input() fileName: string;
  @Input() progress: number;
  @Input() showProgress: boolean;
  @Input() color: ThemePalette;

}
