import Display from "./display.js";
import DebugHandler from "./debugHandler.js";

export default class Device {
  views = ["default", "error", "info", "viewList"];
  display;
  debugHandler;
  config = {
    commandsEnabled: localStorage.getItem("gameNugcommandsEnabled") === "true",
    debugOutput: localStorage.getItem("gameNugdebugOutput") === "true",
  };
  preloadView = "default";

  constructor() {
    this.display = new Display(
      document.querySelector("#top-panel"),
      preloadView ?? null
    );

    this.debugHandler = new DebugHandler(this.display.element);
  }

  /**
   * @summary Makes a fetch request to a given address and saves the response in a Device property
   * @param {string} propName The key of the property which will be assigned the response data
   * @param {string} address JSON-serving endpoint to make the request to
   * @param {string} fetchMethod HTTPS request method to use. Defaults to GET
   * @returns {Promise<object>} Promise containing response data
   */
  async Request(address, fetchMethod = "GET") {
    try {
      const response = await fetch(address, { method: fetchMethod });
      const data = await response.json();
      if (data !== undefined) {
        this[propName] = await data;
        return data;
      } else {
        throw new Error("Response is undefined");
      }
    } catch (err) {
      console.error(err);
    }
  }
}
