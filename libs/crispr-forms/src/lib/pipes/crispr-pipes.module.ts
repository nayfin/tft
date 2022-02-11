import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { InitialControlValuePipe } from "./initial-control-value.pipe";

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    InitialControlValuePipe
  ],
  declarations: [
    InitialControlValuePipe
  ]
})

export class CrisprPipesModule {
}
