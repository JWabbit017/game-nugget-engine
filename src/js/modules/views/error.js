import thisApp from "../../init.js";
import View from "../viewTemplate.js";
import g from "../generic.js";

class ErrorView extends View {
  static unknownError = [
    "UNKNOWN",
    "please contact the developer of the view that caused this error",
  ];

  constructor(err) {
    let refinedError = err;
    if (!err[1]) refinedError = ErrorView.unknownError;

    super(ErrorView.HTML(refinedError), {
      bEvent: ErrorView.returnToPreload,
    });
  }

  static returnToPreload() {
    thisApp.display.postView(thisApp.preloadView);
  }

  static HTML(err) {
    const errorContainer = g.newElement("div");
    errorContainer.setAttribute("id", "error");

    const errorText = g.newElement(
      "h2",
      `${err[0]} => ` + err[1] ??
        "Something went wrong and the creator of this view didn't quite expect that",
    );

    const subtext = g.newElement("p", "Press B to reset the device.");

    errorContainer.appendChild(errorText);
    errorContainer.appendChild(subtext);

    return errorContainer;
  }
}

export default (param = null) => {
  return new ErrorView(param);
};
