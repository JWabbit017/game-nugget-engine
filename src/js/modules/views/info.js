import thisApp from "../../init.js";
import * as DHTML from "../dhtml.js";
import g from "../generic.js";
import View from "../viewTemplate.js";

class Info extends View {
  constructor(text) {
    const previous = thisApp.display.currentImport;

    super(Info.HTML(text));

    setTimeout(() => {
      thisApp.display.postView(previous.element.getAttribute("id"));
    }, 2000);

    this.options.requiresParameter = true;
  }

  static HTML(text) {
    const info = g.newElement("div");
    info.setAttribute("id", "info");

    const infoText = g.newElement("h2", text);

    info.appendChild(infoText);

    return info;
  }
}

export default (param) => {
  return new Info(param);
};
