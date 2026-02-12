import thisApp from "../../init.js";
import View from "../viewTemplate.js";
import g from "../generic.js";

class ErrorView extends View {
  constructor(err) {
    let refinedError = err;
    if (!err[1]) refinedError = thisApp.unknownError;

    super(ErrorView.HTML(refinedError), {
      bEvent: ErrorView.returnToPreload,
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

export default (param) => {
  return new ErrorView(param);
};
