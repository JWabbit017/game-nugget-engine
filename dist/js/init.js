import Device from "./modules/device.js";
import Display from "./modules/display.js";
import DebugHandler from "./modules/debugHandler.js";

const disp = new Display();
const debug = new DebugHandler(disp.element);

const GameNugget = new Device(disp, debug);

export default GameNugget;
