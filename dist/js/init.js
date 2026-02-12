import Display from "./modules/display.js";
import DebugHandler from "./modules/debugHandler.js";
import Device from "./modules/device.js";

const disp = new Display();
const debug = new DebugHandler(disp.element);

const GameNugget = new Device(disp, debug);

export default GameNugget;
