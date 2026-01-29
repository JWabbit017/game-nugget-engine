import thisApp from "../../init.js";
import g from "../generic.js";
import View from "../viewTemplate.js";

let selectedMenuItem = 1;

// Initialising function - see this as the constructor of the view
export default function defaultView() {
  selectedMenuItem = 1;
  const view = new View(HTML(), {
    aEvent: aEvent,
    upEvent: upEvent,
    downEvent: downEvent,
  });
  view.applyArrow = applyArrow;

  return view;
}

function aEvent() {
  thisApp.debugHandler.debugPrompt(aEvent2);
}

function getTarget() {
  const thisLocation = document
    .querySelector(".activeMenuItem")
    .getAttribute("data-location");
  return thisLocation;
}

function aEvent2(value) {
  thisApp.display.postView(getTarget(), value);
}

function upEvent() {
  if (selectedMenuItem > 1) selectedMenuItem--;
  moveMenu();
}

function downEvent() {
  if (selectedMenuItem < thisApp.views.length) selectedMenuItem++;
  moveMenu();
}

function moveMenu() {
  thisApp.debugHandler.createDebug("menu " + selectedMenuItem);
  applyArrow();
}

function applyArrow() {
  document.querySelector(".activeMenuItem").removeAttribute("class");
  document
    .querySelector(`#defaultView li:nth-of-type(${selectedMenuItem})`)
    .setAttribute("class", "activeMenuItem");
}

function HTML() {
  const menu = g.newElement("nav");
  menu.setAttribute("id", "defaultView");
  menu.setAttribute("class", "display-filter");

  const title = g.newElement("h2", "GNE v0.1.6");

  const list = g.newElement("ul");

  for (const view of thisApp.views) {
    if (thisApp.views.includes(view)) {
      const el = g.newElement("li", view);
      el.setAttribute("data-location", view);
      if (view === "defaultView") el.setAttribute("class", "activeMenuItem");

      list.appendChild(el);
    }
  }

  menu.appendChild(title);
  menu.appendChild(list);

  return menu;
}
