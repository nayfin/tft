/** Gets the closest ancestor of an element that matches a selector. */
export function getClosestMatchingAncestor(element: HTMLElement, selector: string) {
  let currentElement = element.parentElement as HTMLElement | null;

  while (currentElement) {
    // IE doesn't support `matches` so we have to fall back to `msMatchesSelector`.
    if (currentElement.matches ? currentElement.matches(selector) :
        (currentElement as any).msMatchesSelector(selector)) {
      return currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return null;
}


/**
 * Create a copy of the HTML Element
 */
export function cloneElement(element: HTMLElement) {

  const clone = element.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  return clone;
}
