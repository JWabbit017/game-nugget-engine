import thisApp from "../../init.js";
import g from "../generic.js";
import View from "../viewTemplate.js";

class DefaultView extends View {
  static selectedMenuItem = 1;

  constructor() {
    super(DefaultView.HTML(), {
      aEvent: DefaultView.requestParameterForView,
      upEvent: DefaultView.menuUp,
      downEvent: DefaultView.menuDown,
    });
  }

  static requestParameterForView() {
    thisApp.debugHandler.debugPrompt(DefaultView.gotoSelected);
  }

  static getTarget() {
    const thisLocation = document
      .querySelector(".activeMenuItem")
      .getAttribute("data-location");
    return thisLocation;
  }

  static menuUp() {
    if (DefaultView.selectedMenuItem > 1) DefaultView.selectedMenuItem--;
    DefaultView.moveMenu();
  }

  static gotoSelected(value) {
    thisApp.display.postView(DefaultView.getTarget(), value);
  }

  static menuDown() {
    if (DefaultView.selectedMenuItem < thisApp.views.length)
      DefaultView.selectedMenuItem++;
    DefaultView.moveMenu();
  }

  static moveMenu() {
    thisApp.debugHandler.createDebug("menu " + DefaultView.selectedMenuItem);
    DefaultView.applyArrow();
  }

  static applyArrow() {
    document.querySelector(".activeMenuItem").removeAttribute("class");
    document
      .querySelector(
        `#defaultView li:nth-of-type(${DefaultView.selectedMenuItem})`,
      )
      .setAttribute("class", "activeMenuItem");
  }

  static HTML() {
    const menu = g.newElement("nav");
    menu.setAttribute("id", "defaultView");
    menu.setAttribute("class", "display-filter");

    const title = g.newElement("h2", "GNE v0.2.1");

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

export default new DefaultView();
