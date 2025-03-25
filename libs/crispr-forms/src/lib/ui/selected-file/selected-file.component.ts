
import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'crispr-selected-file',
  templateUrl: './selected-file.component.html',
  styleUrls: ['./selected-file.component.scss'],
  standalone: true,
  imports: [
    MatProgressBarModule
],
})
export class SelectedFileComponent {

  @Input() fileName: string;
  @Input() progress: number;
  @Input() showProgress: boolean;
  @Input() color: ThemePalette;

}
