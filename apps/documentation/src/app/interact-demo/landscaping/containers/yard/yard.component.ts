import { Component } from '@angular/core';



@Component({
  selector: 'tft-yard',
  templateUrl: './yard.component.html',
  styleUrls: ['./yard.component.scss']
})
export class YardComponent {

  // @ViewChild(DropzoneDirective) dropzone2: DropzoneDirective;



  log(type:string, event: any) {
    console.log(type, event);
  }
}
