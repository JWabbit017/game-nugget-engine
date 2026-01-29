import thisApp from "../../init.js";
import g from "../generic.js";
import View from "../viewTemplate.js";

export default new DefaultView();

class DefaultView extends View {
  selectedMenuItem = 1;

  constructor() {
    super(this.HTML(), {
      aEvent: this.requestParameterForView,
      upEvent: this.menuUp,
      downEvent: this.menuDown,
    });

    this.selectedMenuItem = 1;
  }

  requestParameterForView() {
    thisApp.debugHandler.debugPrompt(aEvent2);
  }

  getTarget() {
    const thisLocation = document
      .querySelector(".activeMenuItem")
      .getAttribute("data-location");
    return thisLocation;
  }

  menuUp() {
    if (selectedMenuItem > 1) selectedMenuItem--;
    this.moveMenu();
  }

  gotoSelected(value) {
    thisApp.display.postView(this.getTarget(), value);
  }

  menuDown() {
    if (selectedMenuItem < thisApp.views.length) selectedMenuItem++;
    this.moveMenu();
  }

  moveMenu() {
    thisApp.debugHandler.createDebug("menu " + selectedMenuItem);
    this.applyArrow();
  }

  applyArrow() {
    document.querySelector(".activeMenuItem").removeAttribute("class");
    document
      .querySelector(`#defaultView li:nth-of-type(${selectedMenuItem})`)
      .setAttribute("class", "activeMenuItem");
  }

  HTML() {
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
}
