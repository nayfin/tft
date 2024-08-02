import { Component } from '@angular/core';
import { FormConfig, ControlType, CrisprFormComponent } from '@tft/crispr-forms';
import { FormGroup } from '@angular/forms';
import { EndpointsService } from '../../endpoints.service';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'doc-map',
  templateUrl: './map.component.html',
  standalone: true,
  imports: [
    CrisprFormComponent,
    MatCardModule
  ],
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  mapConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.MAP,
        label: 'This map field uses a simple array of options',
        controlName: 'mapField',
        center: {
          lat: 38.8809704,
          lng: -90.73427339999999
        },
        options: {
          mapId: 'DEMO_MAP_ID',
        },
        markers: [
          {
            title: 'Place A',
            position:  { lat: -31.56391, lng: 147.154312 },
          },
          {
            title: 'Place B',
            position: { lat: -33.727111, lng: 150.371124 },
          },
          {
            title: 'Place C',
            position: { lat: -33.718234, lng: 150.363181 },
          }
        ],
        onMove: (event, group) => console.log({event, group}),
        onMarkerClick: (marker) => {
          console.log({marker})
        }
        // validators: [Validators.required]
      },
     
      {
        controlType: ControlType.BUTTON,
        label: 'SUBMIT',
        type: 'submit'
      }
    ]
  }

  
  constructor(
    private endpointsService: EndpointsService
  ) { }

  handleSubmit(form: FormGroup) {
    console.log({value: form.value})
  }

}
