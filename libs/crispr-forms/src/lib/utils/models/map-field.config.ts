import { FormGroup } from "@angular/forms";
import { ControlType, CrisprControlConfig, FieldDescriptors, MatFieldProperties } from "./crispr-field.config";
import { GoogleMap } from "@angular/google-maps";
import { Observable } from "rxjs";

export type MapFieldConfig<OMCT = unknown, OMT = unknown> = CrisprControlConfig & MatFieldProperties & FieldDescriptors & {
  controlType: ControlType.MAP;
  label: string;
  center?: google.maps.LatLngLiteral;
  location?: string; // google.maps.places.AutocompleteSuggestion;

  options?: google.maps.MapOptions;
  debounceTime?: number;
  markers?: (map: GoogleMap, group: FormGroup) => Observable<TftMapMarker[]>;
  // markerTemplateBuilder?: TemplateBuilder<TftMapMarker>;
  infoWindowTemplateBuilder?: TemplateBuilder<TftMapMarker>;
  valueDisplayKey?: string;
  // markerClasses?: string[];
  onMove?: (map: GoogleMap, group: FormGroup) => OMT;
}

export type TftMapMarker<DT = unknown> = google.maps.marker.AdvancedMarkerElementOptions & { value: DT };
export type TemplateBuilder<T> = (props: T) => string;
