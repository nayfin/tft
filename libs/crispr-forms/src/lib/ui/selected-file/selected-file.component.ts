
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'crispr-selected-file',
    templateUrl: './selected-file.component.html',
    styleUrls: ['./selected-file.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatProgressBarModule
    ]
})
export class SelectedFileComponent {

  fileName = input.required<string>();
  progress = input<number>();
  showProgress = input<boolean>();
  color = input<ThemePalette>();

}
