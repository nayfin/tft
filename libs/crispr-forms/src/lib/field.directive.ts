import {
  Directive,
  Input,
  ViewContainerRef,
  Renderer2,
  OnInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  CrisprFieldComponentType,
  FIELD_COMPONENTS,
  isControlComponent,
  isControlOrButtonComponent,
} from './field-component-map.const';
import { AnyFieldConfig, ControlValue } from './utils';

@Directive({
  selector: '[crisprField]',
  standalone: true,
})
export class CrisprFieldDirective implements OnInit {

  @Input() config: AnyFieldConfig;
  @Input() group: FormGroup;
  @Input() testIdPrefix?: string;
  /**
   * value setter updates the control's value as well
   */
  _value: ControlValue | any[];
  @Input() set value(value: ControlValue | any[]) {
    this._value = value;
    // This is needed to keep the group list from resetting control values to the initial input value
    this.updateComponentValue(value);
  }
  get value() {
    return this._value;
  }

  component: CrisprFieldComponentType;

  container  = inject(ViewContainerRef);
  renderer  = inject(Renderer2);
  cdr  = inject(ChangeDetectorRef); 
  
  async ngOnInit() {
    /**
     * create component and set values from config on its instance
     */
    const component =
      this.config.component ||
      (await FIELD_COMPONENTS[this.config.controlType]());
    const componentRef =
      this.container.createComponent<CrisprFieldComponentType>(component);

    this.component = componentRef.instance;
    componentRef.setInput('config', this.config);
    if (isControlOrButtonComponent(this.component)) {
      componentRef.setInput('group', this.group);
    }
    componentRef.setInput('testIdPrefix', this.testIdPrefix);
    this.updateComponentValue(this.value);
    // adds any config classes to the dynamically generated component
    // doing this here keeps us from having to extend a base component into each field component individually
    if (!this.config.classes) return;
    this.config.classes.forEach((klass) => {
      // check for passing multiple classes in one array element
      if (klass.includes(' ')) {
        throw Error(
          `Improperly formatted class. '${klass}' cannot contain spaces.`
        );
      } else {
        this.renderer.addClass(componentRef.location.nativeElement, klass);
      }
    });
  }

  updateComponentValue(value: ControlValue) {
    if (isControlComponent(this.component)) {
      this.component.value.set(value);
      // SubGroups won't populate without this detectChanges
      this.cdr.detectChanges();
    }
  }
}
