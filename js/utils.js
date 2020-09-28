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
//////////////////////////////////////////////////////////////////////////////

export function appendChildrenToParent(children, parent) {
  children.forEach((child) => parent.appendChild(child));

  return parent;
}

//////////////////////////////////////////////////////////////////////////////

export function drawHealthbar(ctx, x, y, width, height, hp, maxHp) {
  if (hp > maxHp) {
    hp = maxHp;
  }
  if (hp < 0) {
    hp = 0;
  }

  let percentHpLeft = Math.round((hp / maxHp) * 100);

  ctx.fillStyle = "#000000";
  ctx.fillRect(x, y, width, height);

  if (percentHpLeft > 50) {
    ctx.fillStyle = "#4da421";
  } else if (percentHpLeft > 10 && percentHpLeft <= 50) {
    ctx.fillStyle = "#ee9e1e";
  } else {
    ctx.fillStyle = "#e62e2d";
  }
  ctx.fillRect(x + 1, y + 1, (hp / maxHp) * (width - 2), height - 2);
}

//////////////////////////////////////////////////////////////////////////////

export function moveFighter() {}
