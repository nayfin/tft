import { SelectOption } from "../models";

/**
 * A basic filter function that filters the search string against the label of the options object
 * @param options the array of options to filter
 * @param searchString the string from the input
 */
 export function filterOptionsByLabel(options: SelectOption[], searchString: string)  {
  return options.filter(option => {
    return option.label && option.label.toLowerCase().includes(searchString.toLowerCase());
  });
}
