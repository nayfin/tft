import { Directive, Input, ViewContainerRef, Renderer2, NgModule, OnInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { AnyFieldConfig, ControlValue } from './models';
import { CrisprFieldComponent, FIELD_COMPONENTS, isControlComponent, isControlOrButtonComponent } from './field-component-map.const';
import { CommonModule } from '@angular/common';

@Directive({
  selector: '[crisprField]'
})
export class CrisprFieldDirective implements OnInit {

  @Input() config: AnyFieldConfig;
  @Input() group: UntypedFormGroup;
  /**
   * value setter updates the control's value as well
   */
  _value: ControlValue | any[]
  @Input() set value(value: ControlValue | any[]) {
    this._value = value;
    // This is needed to keep the group list from resetting control values to the initial input value
    this.updateComponentValue(value);
  };
  get value() {
    return this._value;
  }
  component: CrisprFieldComponent;

  constructor(
    private container: ViewContainerRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    /**
     * create component and set values from config on its instance
     */
    const component = this.config.component || await FIELD_COMPONENTS[this.config.controlType];
    const componentRef = this.container.createComponent<CrisprFieldComponent>(component);

    this.component = componentRef.instance;
    this.component.config = this.config;
    if (isControlOrButtonComponent(this.component)) {
      this.component.group = this.group;
    }
    this.updateComponentValue(this.value);
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

  updateComponentValue(value: ControlValue | any[]) {
    if(isControlComponent(this.component)) {
      this.component.value = value;
      // SubGroups won't populate without this detectChanges
      this.cdr.detectChanges();
    }
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
