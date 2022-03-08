import { Directive, Input, ViewContainerRef, Renderer2, NgModule, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import type { AnyFieldConfig, ControlValue } from './models';
import { CrisprFieldComponent, FIELD_COMPONENTS, isControlComponent } from './field-component-map.const';
import { CommonModule } from '@angular/common';

@Directive({
  selector: '[crisprField]'
})
export class CrisprFieldDirective implements OnChanges {

  @Input() config: AnyFieldConfig;
  @Input() group: FormGroup;
  @Input() value: ControlValue | any[];
  component: CrisprFieldComponent;

  constructor(
    private container: ViewContainerRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnChanges() {
    /**
     * create component and set values from config on its instance
     */
    const component = this.config.component || await FIELD_COMPONENTS[this.config.controlType];
    const componentRef = this.container.createComponent<CrisprFieldComponent>(component);

    this.component = componentRef.instance;
    this.component.config = this.config;
    if ( isControlComponent(this.component)) {
      this.component.group = this.group;
      if ('value' in this.component) {
        this.component.value = this.value;
      }
    }
    this.cdr.detectChanges();
    // adds any config classes to the dynamically generated component
    // doing this here keeps us from having to extend a base component into each field component individually
    if(!this.config.classes) return;
    this.config.classes.forEach((klass) => {
      // check for passing multiple classes in one array element
      if(klass.includes(' ')) {
        throw Error(`Improperly formatted class. '${klass}' cannot contain spaces.`);
      } else {
        this.renderer.addClass(componentRef.location.nativeElement, klass);
      }
    });
  }
}
@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    CrisprFieldDirective
  ],
  declarations: [
    CrisprFieldDirective
  ]
})
export class CrisprFieldModule {
}
