import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@tft/api-interfaces';
import { DraggableOptions } from '@interactjs/types/types';
import interact from 'interactjs';

@Component({
  selector: 'tft-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  hello$ = this.http.get<Message>('/api/hello');
  
  dragConfig: DraggableOptions = {
    inertia: true,
    allowFrom: '.handle'   
  }
  constructor(private http: HttpClient) {}


}
