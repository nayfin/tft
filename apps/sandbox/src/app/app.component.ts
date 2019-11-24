import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@tft/api-interfaces';
import { interval } from 'rxjs';
import { DropzoneDirective, TftDropEvent} from '@tft/interact'
import { DraggableOptions, DropzoneOptions } from '@interactjs/types/types';
import { tap, take, switchMap, delay } from 'rxjs/operators';
import interact from 'interactjs';

@Component({
  selector: 'tft-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {


}
