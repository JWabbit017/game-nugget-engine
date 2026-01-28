import Device from "./modules/device.js";
import Display from "./modules/display.js";
import DebugHandler from "./modules/debugHandler.js";

const display = new Display(document.querySelector("#top-panel"));
const debugHandler = new DebugHandler(display.element);

const GameNugget = new Device(display, debugHandler);

export default GameNugget;
export { Display, DebugHandler };
