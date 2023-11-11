import {
  Directive,
  Input,
  ViewContainerRef,
  OnInit,
  ChangeDetectorRef,
  Type,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ControlValue,
  CrisprDisplayFieldComponent,
} from '@tft/crispr-forms/utils';

@Directive({
  selector: '[crisprDisplayField]',
  standalone: true,
})
export class CrisprDisplayFieldDirective implements OnInit {
  @Input() group: FormGroup;
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

  @Input() private component: Type<CrisprDisplayFieldComponent>;

  @Input() index?: number;

  private componentInstance: CrisprDisplayFieldComponent;

  constructor(
    private container: ViewContainerRef,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    if (this.component) {
      /**
       * create component and set values from config on its instance
       */
      const componentRef = this.container.createComponent(this.component);

      this.componentInstance = componentRef.instance;
      this.componentInstance.index = this.index;
      this.updateComponentValue(this.value);
    }
  }

  updateComponentValue(value: ControlValue | any[]) {
    if (!this.componentInstance) return;
    this.componentInstance.value = value;
    this.cdr.detectChanges();
  }
}
