export function createHTMLElement(
  tagName,
  className,
  textContent,
  attributes,
  event
) {
  let element = document.createElement(tagName);
  if (className) {
    element.classList.add(className);
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  if (attributes) {
    attributes.forEach((a) => element.setAttribute(a.k, a.v));
  }

  if (event) {
    element.addEventListener(event.name, event.func);
  }

  return element;
}

export function appendChildrenToParent(children, parent) {
  children.forEach((child) => parent.appendChild(child));

  return parent;
}
