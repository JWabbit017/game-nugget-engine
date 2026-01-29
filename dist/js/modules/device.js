import Display from "./display.js";
import DebugHandler from "./debugHandler.js";

export default class Device {
  views = ["defaultView", "error", "info"];
  display;
  debugHandler;
  config = {
    commandsEnabled: localStorage.getItem("gameNugcommandsEnabled") === "true",
    debugOutput: localStorage.getItem("gameNugdebugOutput") === "true",
  };
  preloadView = "defaultView";
  viewDir = "./views";

  /**
   * @param {Display} display
   * @param {DebugHandler} debugHandler
   */
  constructor(display, debugHandler) {
    this.display = display;
    this.debugHandler = debugHandler;
  }

  /**
   * @summary Initialises the Game Nugget with the preload specified in this.preloadView, or defaultView if null.
   */
  start() {
    try {
      if (!this.display || !this.debugHandler)
        throw "One or more subsystems are undefined";

      this.display.preload(this.preloadView);
    } catch (err) {
      console.error(err);
    }
  }

  mountApp(appInstance) {
    this.app = appInstance;
    this.preloadView = this.app?.preloadView ?? "defaultView";
  }
}
