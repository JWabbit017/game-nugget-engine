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
  unknownError = [
    "UNKNOWN",
    "please contact the developer of the view that caused this error",
  ];

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
   * This method should in most cases be called at the very end of your app's script, and after mountApp has finished.
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

  /**
   * @summary Mounts your app to the Game Nugget as GameNugget.app.
   * @param {object} appInstance A class instance serving as the entry point for your app.
   */
  mountApp(appInstance) {
    this.app = appInstance;
    this.preloadView = this.app?.preloadView ?? "defaultView";
  }
}
