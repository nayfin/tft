import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrisprFieldComponent, MapFieldConfig, crisprControlMixin } from '../../utils';

const defaultConfig: Partial<MapFieldConfig> = {
  
};
const MapFieldMixin = crisprControlMixin<MapFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-field.component.html',
  styleUrl: './map-field.component.scss',
})
export class MapFieldComponent
  extends MapFieldMixin
  implements OnInit
{
  defaultConfig = defaultConfig;
  ngOnInit() {
    super.ngOnInit();
  }
}