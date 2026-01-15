import thisApp from "../../init.js";
import g from "../generic.js";
import View from "../viewTemplate.js";

let selectedMenuItem = 1;

// Initialising function - see this as the constructor of the view
export default function defaultView() {
  const view = new View(HTML(), {
    aEvent: aEvent,
    upEvent: upEvent,
    downEvent: downEvent,
  });
  view.applyArrow = applyArrow;

  return view;
}

function aEvent() {
  const thisLocation = document
    .querySelector(".activeMenuItem")
    .getAttribute("data-location");

  thisApp.display.postView(thisLocation);
}

function upEvent() {
  if (selectedMenuItem > 1) selectedMenuItem--;
  moveMenu();
}

function downEvent() {
  if (selectedMenuItem < 3) selectedMenuItem++;
  moveMenu();
}

function moveMenu() {
  thisApp.debugHandler.createDebug("menu " + selectedMenuItem);
  applyArrow();
}

function applyArrow() {
  document.querySelector(".activeMenuItem").removeAttribute("class");
  document
    .querySelector(`#menu li:nth-of-type(${selectedMenuItem})`)
    .setAttribute("class", "activeMenuItem");
}

function HTML() {
  const menu = g.newElement("nav");
  menu.setAttribute("id", "defaultView");
  menu.setAttribute("class", "display-filter");

  const title = g.newElement("h2", "GAME NUGGET");

  const list = g.newElement("ul");

  for (const view of thisApp.views) {
    const el = g.newElement("li", view);
    el.setAttribute("data-location", view);

    list.appendChild(el);
  }

  list.appendChild(pokedex);
  list.appendChild(pokemon);
  list.appendChild(save);

  menu.appendChild(title);
  menu.appendChild(list);

  return menu;
}
