import View from "../viewTemplate.js";
import thisApp from "../../init.js";
import g from "../generic.js";
import defaultView from "./defaultView.js";
import error from "./error.js";
import info from "./info.js";
import terminal from "./terminal.js";
import log from "./log.js";

class ReloadViews extends View {
  constructor() {
    // Doing this forces the browser to actually get the files fresh which updates the cache
    const a = [defaultView, error, info, terminal, log];

    console.log(a);

    super(ReloadViews.HTML, {});

    setTimeout(() => {
      thisApp.display.preload(thisApp.preloadView);
    }, 1500);
  }

  static HTML() {
    return g.newElement("h2", "Successfully reloaded internal views");
  }
}

export default new ReloadViews();
