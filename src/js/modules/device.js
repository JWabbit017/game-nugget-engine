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
    this.display.preload(this.preloadView);
  }

  mountApp(appInstance) {
    this.app = appInstance;
  }
}
