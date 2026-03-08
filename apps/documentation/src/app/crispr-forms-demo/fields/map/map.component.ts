import { Component, inject } from '@angular/core';
import { FormConfig, ControlType, CrisprFormComponent } from '@tft/crispr-forms';
import { FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs/operators';
import { GCAreaCoordinates } from './geocode.model';
import { NoaaService } from './noaa.service';
import { of } from 'rxjs';


@Component({
    selector: 'doc-map',
    templateUrl: './map.component.html',
    imports: [
        CrisprFormComponent,
        MatCardModule
    ],
    styleUrls: ['./map.component.scss']
})
export class MapComponent {
  noaaService = inject(NoaaService);
  mapValue = {
  }
  mapConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.MAP,
        label: 'This map field uses a simple array of options',
        controlName: 'mapField',
        center: {
          lat:  38.8809704, lng: -90.73427339999999
        },
        options: {
          mapId: 'DEMO_MAP_ID',
        },
        markers: (mapComponent, formGroup) => { 
          const bounds = mapComponent?.getBounds()?.toJSON();
          if (!bounds) {
            return of([]);
          }
          const coords: GCAreaCoordinates = {
            ymax: bounds.north,
            ymin: bounds.south,
            xmax: bounds.east,
            xmin: bounds.west
          }  
          return this.noaaService.getValidStationIds(coords).pipe(
            map((stations) => {
              return stations.map(station => {
                const {location } = station;
                const [lng, lat] = location.coordinates;

                const {name, id} = station.stations[0];
                const mappedStation = {
                  name,
                  id,
                  location
                }
                return {
                  title: name,
                  position: {lat, lng },
                  value: mappedStation,
                }
              })
            }),
            // switchMap((stations) => {
            //   return this.noaaService.getFostDateProbabilities()
            // })
          )
        },
        // markerClasses: ['weather-station-map-marker'],
        infoWindowTemplateBuilder: (marker) => {
          console.log({marker})
          return `<div>
          ${marker.title}
          </div>`
        },
        valueDisplayKey: 'name',
        onMove: (event, group) => console.log({event, group}),
        // validators: [Validators.required]
      },
      {
        controlType: ControlType.BUTTON,
        label: 'SUBMIT',
        type: 'submit'
      }
    ]
  }

  handleSubmit(form: FormGroup) {
    console.log({value: form.value})
  }

}

