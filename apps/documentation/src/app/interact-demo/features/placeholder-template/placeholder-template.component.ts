import { Component } from '@angular/core';
import { DraggableOptions } from '@interactjs/types/index';

@Component({
  selector: 'tft-placeholder-template',
  templateUrl: './placeholder-template.component.html',
  styleUrls: ['./placeholder-template.component.scss']
})
export class PlaceholderTemplateComponent {

  dragConfig: DraggableOptions = {allowFrom: '.handle'}

}
