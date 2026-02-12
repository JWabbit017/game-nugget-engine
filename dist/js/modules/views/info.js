import thisApp from "../../init.js";
import View from "../viewTemplate.js";
import g from "../generic.js";

class Info extends View {
  constructor(text) {
    super(Info.HTML(text));

    const previous = thisApp.display.currentImport;

    setTimeout(() => {
      thisApp.display.postView(previous.element.getAttribute("id"));
    }, 2000);
  }

  static HTML(text) {
    const errorContainer = g.newElement("div");
    errorContainer.setAttribute("id", "info");

    const infoText = g.newElement("h2", text);

    errorContainer.appendChild(infoText);

    return errorContainer;
  }
}

export default (param) => {
  return new Info(param);
};
