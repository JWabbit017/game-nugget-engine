import GameNugget from "../../init.js";
import g from "../generic.js";
import View from "../viewTemplate.js";

class Log extends View {
  previous;
  static filter = false;

  constructor() {
    super(Log.HTML, {
      postWrite: Log.postWrite,
      a: Log.aEvent,
      b: Log.filterDebug,
    });

    this.previous = GameNugget.display.currentView?.id ?? "defaultView";

    // TODO: Fix log view not being able to refresh anything happening while it is on screen - including its own postWrite
  }

  static postWrite() {
    const reversed = GameNugget.logger.logs.reverse();
    for (const entry of reversed) {
      const entryLine = g.newElement("span", `[${entry[0]}]: ${entry[1]}`);

      const filter = entry[1].match(/----(\w+):/gm);
      if (filter) {
        entryLine.setAttribute(
          "class",
          filter[0].substring(4, filter[0].length - 1).toLowerCase(),
        );

        GameNugget.display.currentView.appendChild(entryLine);
        continue;
      }

      if (!Log.filter) GameNugget.display.currentView.appendChild(entryLine);
    }
    GameNugget.logger.logs.reverse();
  }

  static aEvent() {
    GameNugget.logger.clear();
    GameNugget.display.refresh();
  }

  static filterDebug() {
    Log.filter = !Log.filter;
    GameNugget.display.refresh();
  }

  static HTML() {
    const log = g.newElement("div");
    log.setAttribute("id", "log");

    const msg = g.newElement(
      "span",
      "Press A to clear logs; Press B to filter",
    );
    log.appendChild(msg);
    log.innerHTML += "<br>";

    return log;
  }
}

export default new Log();
