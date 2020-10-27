import { EmbeddedViewRef } from '@angular/core';

interface IEElement extends HTMLElement {
  msMatchesSelector: (selector: string) => boolean; //
}

/** Gets the closest ancestor of an element that matches a selector. */
export function getClosestMatchingAncestor(element: HTMLElement, selector: string) {
  let currentElement = element.parentElement as HTMLElement | null;

  while (currentElement) {
    // IE doesn't support `matches` so we have to fall back to `msMatchesSelector`.
    if (currentElement.matches ? currentElement.matches(selector) :
        (currentElement as IEElement).msMatchesSelector(selector)) {
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

/**
 * Gets the root HTML element of an embedded view.
 * If the root is not an HTML element it gets wrapped in one.
 */
export function getRootNode(viewRef: EmbeddedViewRef<any>, _document: Document): HTMLElement {
  const rootNodes: Node[] = viewRef.rootNodes;

  if (rootNodes.length === 1 && rootNodes[0].nodeType === _document.ELEMENT_NODE) {
    return rootNodes[0] as HTMLElement;
  }

  const wrapper = _document.createElement('div');
  rootNodes.forEach(node => wrapper.appendChild(node));
  return wrapper;
}
