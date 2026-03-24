import {
  ComponentRef,
  Directive,
  effect,
  inject,
  input,
  OnInit,
  Renderer2,
  ViewContainerRef,
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

  config = input<AnyFieldConfig>();
  group = input<FormGroup>();
  testIdPrefix = input<string | undefined>(undefined);
  value = input<ControlValue | any[]>();

  private componentRef: ComponentRef<CrisprFieldComponentType>;
  component: CrisprFieldComponentType;

  container = inject(ViewContainerRef);
  renderer  = inject(Renderer2);

  constructor() {
    effect(() => {
      this.updateComponentValue(this.value());
    });
  }

  async ngOnInit() {
    const component =
      this.config().component ||
      (await FIELD_COMPONENTS[this.config().controlType]());

    this.componentRef =
      this.container.createComponent<CrisprFieldComponentType>(component);

    this.component = this.componentRef.instance;
    this.componentRef.setInput('config', this.config());
    if (isControlOrButtonComponent(this.component)) {
      this.componentRef.setInput('group', this.group());
    }
    this.componentRef.setInput('testIdPrefix', this.testIdPrefix());
    this.updateComponentValue(this.value());

    if (!this.config().classes) return;
    this.config().classes.forEach((klass) => {
      if (klass.includes(' ')) {
        throw Error(
          `Improperly formatted class. '${klass}' cannot contain spaces.`
        );
      } else {
        this.renderer.addClass(this.componentRef.location.nativeElement, klass);
      }
    });
  }

  updateComponentValue(value: ControlValue) {
    if (this.componentRef && isControlComponent(this.component)) {
      this.componentRef.setInput('value', value);
    }
  }
}
