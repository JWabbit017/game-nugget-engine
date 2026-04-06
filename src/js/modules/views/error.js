import thisApp from "../../init.js";
import g from "../generic.js";
import View from "../viewTemplate.js";

class ErrorView extends View {
  static unknownError = [
    "UNKNOWN",
    "please contact the developer of the view that caused this error",
  ];

  constructor(err) {
    let refinedError = err;
    if (!err[1]) refinedError = ErrorView.unknownError;

    super(ErrorView.HTML(refinedError), {
      b: ErrorView.gotoPreload,
    });

    this.options.requiresParameter = true;
  }

  static gotoPreload() {
    thisApp.display.postView(thisApp.preloadView);
  }

  static HTML(err) {
    const error = g.newElement("div");
    error.setAttribute("id", "error");

    const errText = g.newElement("h2", `${err[0] ?? "ERROR"}: ${err[1] ?? ""}`);

    const help = g.newElement("p", "Press B to reset the device.");

    error.appendChild(errText);
    error.appendChild(help);

    return error;
  }
}

export default (param = null) => {
  return new ErrorView(param);
};
