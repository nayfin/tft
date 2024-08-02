import { FormGroup } from "@angular/forms";
import { ControlType, CrisprControlConfig } from "./crispr-field.config";
import { GoogleMap } from "@angular/google-maps";
import { Observable } from "rxjs";

export type MapFieldConfig = CrisprControlConfig & {
  controlType: ControlType.MAP;
  label: string;
  center: google.maps.LatLngLiteral;
  options?:google.maps.MapOptions;
  markers?: (map: GoogleMap, group: FormGroup) => Observable<google.maps.marker.AdvancedMarkerElementOptions[]>;
  onMove?: (map: GoogleMap, group: FormGroup) => unknown;
  onMarkerClick?: (marker: google.maps.marker.AdvancedMarkerElementOptions) => unknown;
}