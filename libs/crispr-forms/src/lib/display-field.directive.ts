import { ComponentRef, Directive, effect, inject, input, OnInit, Type, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ControlValue,
  CrisprDisplayFieldComponent,
} from './utils';

@Directive({
  selector: '[crisprDisplayField]',
  standalone: true,
})
export class CrisprDisplayFieldDirective implements OnInit {
  private container = inject(ViewContainerRef);

  group = input<FormGroup>();
  value = input<ControlValue | any[]>();
  component = input<Type<CrisprDisplayFieldComponent>>();
  index = input<number>();

  private componentRef: ComponentRef<CrisprDisplayFieldComponent>;
  private componentInstance: CrisprDisplayFieldComponent;

  constructor() {
    effect(() => {
      this.updateComponentValue(this.value());
    });
  }

  async ngOnInit() {
    if (this.component()) {
      const componentRef = this.container.createComponent(this.component());

      this.componentRef = componentRef;
      this.componentInstance = componentRef.instance;
      this.componentInstance.index = this.index();
      this.updateComponentValue(this.value());
    }
  }

  updateComponentValue(value: ControlValue | any[]) {
    if (!this.componentRef) return;
    this.componentRef.setInput('value', value);
  }
}
