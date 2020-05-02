import { Directive, Input, ComponentFactoryResolver, ViewContainerRef, OnInit, HostBinding, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormGroupListComponent } from './form-group-list/form-group-list.component';
import { FormGroupComponent } from './form-group/form-group.component';
import { AnyFieldConfig } from './models';
import {
  InputFieldComponent,
  SelectFieldComponent,
  AutocompleteFieldComponent,
  CheckboxFieldComponent,
  TextareaFieldComponent,
  ButtonComponent,
  DatepickerFieldComponent,
  SliderFieldComponent,
  HeadingComponent,
  DividerComponent,
  AutocompleteChiplistFieldComponent
} from './material';

const components = {
  button: ButtonComponent,
  input: InputFieldComponent,
  select: SelectFieldComponent,
  group: FormGroupComponent,
  groupList: FormGroupListComponent,
  autocomplete: AutocompleteFieldComponent,
  autocompleteChiplist: AutocompleteChiplistFieldComponent,
  textarea: TextareaFieldComponent,
  checkbox: CheckboxFieldComponent,
  slider: SliderFieldComponent,
  datepicker: DatepickerFieldComponent,
  heading: HeadingComponent,
  divider: DividerComponent
};

@Directive({
  selector: '[crisprField]'
})
export class CrisprFieldDirective implements OnInit {

  @Input() config: AnyFieldConfig;
  @Input() group: FormGroup;

  // TODO: strongly type component
  component: any;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    /**
     * create component and set values from config on its instance
     */
    const component = components[this.config.controlType];
    const factory = this.resolver.resolveComponentFactory<any>(component);
    const componentRef = this.container.createComponent(factory);

    this.component = componentRef.instance;
    this.component.config = this.config;
    this.component.group = this.group;
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
