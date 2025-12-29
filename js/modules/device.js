import Display from "./display.js";
import DebugHandler from "./debugHandler.js";

export default class Device {
  pokemon = [];
  display;
  debugHandler;
  config = {
    commandsEnabled: localStorage.getItem("gameNugcommandsEnabled") === "true",
    debugOutput: localStorage.getItem("gameNugdebugOutput") === "true",
  };

  constructor() {
    this.display = new Display(
      document.querySelector("#top-panel"),
      "mainMenu"
    );

    this.debugHandler = new DebugHandler(this.display.element);
  }
}
