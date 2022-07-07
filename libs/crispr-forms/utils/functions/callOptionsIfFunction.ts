import { FormGroup } from "@angular/forms";
import { AutocompleteOptionsCallback, OptionsType } from "../models";

export function callOptionsIfFunction(
  options: OptionsType | AutocompleteOptionsCallback,
  parentGroup?: FormGroup,
  searchString?: string
): OptionsType {
  return options instanceof Function ? options(parentGroup, searchString) : options;
}
