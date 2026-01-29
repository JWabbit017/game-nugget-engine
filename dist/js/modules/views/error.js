import thisApp from "../../init.js";
import View from "../viewTemplate.js";
import g from "../generic.js";

class Error extends View {
  constructor() {
    super(Error.HTML(thisApp.lastError), {
      bEvent: Error.returnToPreload,
    });
  }

  static returnToPreload() {
    thisApp.display.postView(thisApp.preloadView, null);
  }

  static HTML(err) {
    const errorContainer = g.newElement("div");
    errorContainer.setAttribute("id", "error");

    const errorText = g.newElement("h2", `${err[0]}: ` + err[1] ?? err[0]);

    const subtext = g.newElement("p", "Press B to reset the device.");

    errorContainer.appendChild(errorText);
    errorContainer.appendChild(subtext);

    return errorContainer;
  }
}

export default new Error();
