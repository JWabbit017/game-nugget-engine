import thisApp from "../../init.js";
import View from "../viewTemplate.js";

class ErrorView extends View {
  static unknownError = [
    "UNKNOWN",
    "please contact the developer of the view that caused this error",
  ];

  constructor(err) {
    let refinedError = err;
    if (!err[1]) refinedError = ErrorView.unknownError;

    super(ErrorView.HTML(refinedError), { b: ErrorView.gotoPreload });

    this.options.requiresParameter = true;
  }

  static gotoPreload() {
    thisApp.display.postView(thisApp.preloadView);
  }

  static HTML(err) {
    return `
      <div id="error">
        <h2>${err[0] ?? "UNKNOWN"} => ${err[1] ?? "Something went wrong and the creator of this view didn't quite expect that"}</h2>
        <p>Press B to reset the device.</p>
      </div>
    `;
  }
}

export default (param = null) => {
  return new ErrorView(param);
};
