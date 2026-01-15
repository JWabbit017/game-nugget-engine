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

  /**
   * @param {Display} display
   * @param {DebugHandler} debugHandler
   */
  constructor(display, debugHandler) {
    this.display = display;
    this.debugHandler = debugHandler;
    this.initDisplay();
  }

  initDisplay() {
    this.display.preload(this.preloadView);
  }
}
