import Display from "./display.js";
import DebugHandler from "./debugHandler.js";
import Logger from "./logging.js";

export default class Device {
  views = [
    "reloadViews",
    "error",
    "info",
    "dialouge",
    "defaultView",
    "terminal",
    "log",
    "test",
  ];
  display;
  debugHandler;
  logger;
  config = JSON.parse(localStorage.getItem("GNEConfig") ?? "{}");
  preloadView = "defaultView";
  viewDir = "./views";

  /**
   * @param {Display} display
   * @param {DebugHandler} debugHandler
   */
  constructor(display, debugHandler) {
    this.logger = new Logger();
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
      this.#bindTerminalButton();
      this.#bindLogButton();

      this.logger.log("GNE initialised successfully");
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * @summary For options with a boolean values
   * @returns {boolean} true if option value EQUALS "true", else false.
   */
  optionEnabled(option) {
    if (this.config[option]) {
      return this.config[option] === "true";
    }
    this.logger.log(`Attempted to access unset config option '${option}'`);
    return false;
  }

  setOption(option, value = "") {
    this.config[option] = value;
    this.#refreshConfig();

    this.logger.log(`----CONFIG: option ${option} set to ${value}`);
  }

  #refreshConfig() {
    localStorage.setItem("GNEConfig", JSON.stringify(this.config));
    this.config = JSON.parse(localStorage.getItem("GNEConfig"));
  }

  #bindTerminalButton() {
    document.querySelector("#toggle-gns")?.addEventListener("click", () => {
      if (this.display.currentView.id !== "terminal") {
        this.display.postView("terminal");
      } else {
        this.display.postView(this.display.currentImport?.previous);
      }
    });
  }

  #bindLogButton() {
    document.querySelector("#toggle-log")?.addEventListener("click", () => {
      if (this.display.currentView.id !== "log") {
        this.display.postView("log");
      } else {
        this.display.postView(this.display.currentImport?.previous);
      }
    });
  }

  /**
   * @summary Mounts your app to the Game Nugget as GameNugget.app.
   * @param {object} appInstance A class instance serving as the entry point for your app.
   */
  mountApp(appInstance) {
    this.app = appInstance;
    this.preloadView = this.app?.preloadView ?? "defaultView";
  }

  error(errorOrigin, errorMessage) {
    try {
      if (!this?.display) throw "GNE initialisation error";

      this.display.postView("error", [errorOrigin, errorMessage]);
      this.logger.log(`----ERROR: ${errorMessage} in ${errorOrigin}`);
    } catch (err) {
      console.error(err);
      return;
    }
  }
}
