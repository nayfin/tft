import { FormGroup } from "@angular/forms";
import { ControlType, CrisprControlConfig, FieldDescriptors, MatFieldProperties } from "./crispr-field.config";
import { GoogleMap } from "@angular/google-maps";
import { Observable } from "rxjs";

export type MapFieldConfig<OMCT = unknown, OMT = unknown> = CrisprControlConfig & MatFieldProperties & FieldDescriptors & {
  controlType: ControlType.MAP;
  label: string;
  center?: google.maps.LatLngLiteral;
  location?: google.maps.places.AutocompleteSuggestion;
  options?: google.maps.MapOptions;
  debounceTime?: number;
  markers?: (map: GoogleMap, group: FormGroup) => Observable<TftMapMarker[]>;
  // markerTemplateBuilder?: TemplateBuilder<TftMapMarker>;
  infoWindowTemplateBuilder?: TemplateBuilder<TftMapMarker>;

  // markerClasses?: string[];
  onMove?: (map: GoogleMap, group: FormGroup) => OMT;
  onMarkerClick?: (marker: TftMapMarker) => OMCT;
}

export type TftMapMarker<DT = unknown> = google.maps.marker.AdvancedMarkerElementOptions & { data?: DT };
export type TemplateBuilder<T> = (props: T) => string;
