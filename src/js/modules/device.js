import Display from "./display.js";
import DebugHandler from "./debugHandler.js";

export default class Device {
  views = ["reloadViews", "defaultView", "error", "info"];
  display;
  debugHandler;
  config = {
    commandsEnabled: localStorage.getItem("gameNugcommandsEnabled") === "true",
    debugOutput: localStorage.getItem("gameNugdebugOutput") === "true",
  };
  _config = JSON.parse(localStorage.getItem("GNEConfig") ?? "{}");
  preloadView = "defaultView";
  viewDir = "./views";

  get config() {
    return this._config;
  }

  /**
   * @param {Display} display
   * @param {DebugHandler} debugHandler
   */
  constructor(display, debugHandler) {
    this.display = display;
    this.debugHandler = debugHandler;

    if (this._config === {}) this._config = this.config;
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

  config_set(option, value = "") {
    this._config[option] = value;
    this.#refreshConfig();
  }

  #refreshConfig() {
    localStorage.setItem("GNEConfig", JSON.stringify(this._config));
    this._config = JSON.parse(localStorage.getItem("GNEConfig"));
  }

  error(errorOrigin, errorMessage) {
    try {
      if (!this?.display) throw "GNE initialisation error";

      this.display.postView("error", [errorOrigin, errorMessage]);
    } catch (err) {
      console.error(err);
      return;
    }
  }
}
