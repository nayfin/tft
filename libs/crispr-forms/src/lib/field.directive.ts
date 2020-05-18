import { Directive, Input, ComponentFactoryResolver, ViewContainerRef, OnInit, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AnyFieldConfig } from './models';
import { CrisprFieldComponent , FIELD_COMPONENTS, isControlComponent } from './field-component-map.const';

@Directive({
  selector: '[crisprField]'
})
export class CrisprFieldDirective implements OnInit {

  @Input() config: AnyFieldConfig;
  @Input() group: FormGroup;

  component: CrisprFieldComponent;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    /**
     * create component and set values from config on its instance
     */
    const component = FIELD_COMPONENTS[this.config.controlType];
    const factory = this.resolver.resolveComponentFactory<CrisprFieldComponent>(component);
    const componentRef = this.container.createComponent(factory);

    this.component = componentRef.instance;
    this.component.config = this.config;
    if ( isControlComponent(this.component)) {
      this.component.group = this.group;
    }
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
