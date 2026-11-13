import { NgModule } from "@angular/core";
import { InitialControlValuePipe } from "./initial-control-value.pipe";

/**
 * @deprecated Import the standalone InitialControlValuePipe directly.
 * This module will be removed in the next major version.
 */
@NgModule({
  imports: [InitialControlValuePipe],
  exports: [InitialControlValuePipe],
})
export class CrisprPipesModule {
}
