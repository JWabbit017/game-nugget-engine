import GameNugget from "../../init.js";
import g from "../generic.js";
import View from "../viewTemplate.js";

class Log extends View {
  previous;

  constructor() {
    super(Log.HTML, {
      postWrite: Log.postWrite,
      a: Log.clearLogs,
    });

    this.previous = GameNugget.display.currentView?.id ?? "defaultView";
  }

  static postWrite() {
    const reversed = GameNugget.logger.logs.reverse();
    for (const entry of reversed) {
      const entryLine = g.newElement("span", `[${entry[0]}]: ${entry[1]}`);
      GameNugget.display.currentView.appendChild(entryLine);
    }
  }

  static clearLogs() {
    GameNugget.logger.logs = [];
    GameNugget.display.postView("log");
  }

  static HTML() {
    const log = g.newElement("div");
    log.setAttribute("id", "log");

    const msg = g.newElement("span", "Press A to clear logs");
    log.appendChild(msg);
    log.innerHTML += "<br>";

    return log;
  }
}

export default new Log();
