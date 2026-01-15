import thisApp from "../init.js";
import g from "./generic.js";

export default class DebugHandler {
  loc;

  constructor(place) {
    this.loc = place;

    document.addEventListener("keydown", (event) => {
      if (event.key === "t" && document.querySelector("#debug") === null) {
        this.#createCommandInterface(event);
      }
    });
  }

  debugPresent() {
    return document.querySelector("#debug") === null ? false : true;
  }

  /**
   * @summary Creates a temporary debug message on the display.
   * @param {string} text The debug message.
   * @param {boolean} queue If this message is to be queued behind other debugs currently on page. Defaults to false.
   */
  createDebug(text, queue = false) {
    if (thisApp.config.debugOutput) {
      if (this.debugPresent() && queue) {
        setTimeout(() => {
          this.#postDebug(text);
        }, 1000);
      } else {
        this.#postDebug(text);
      }
    }
  }

  #postDebug(text) {
    const debug = g.newElement("span", "<" + text + ">");
    debug.setAttribute("id", "debug");
    debug.setAttribute("class", "display-filter");

    this.loc.appendChild(debug);

    setTimeout(() => {
      if (g.isValidObject(document.querySelector("#debug")))
        document.querySelector("#debug").remove();
    }, 1000);
  }

  #createCommandInterface() {
    const command = g.newElement("aside");
    command.setAttribute("id", "debug");
    command.setAttribute("class", "display-filter");

    const input = g.newElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("autofocus", "true");

    const go = g.newElement("button", "GO");

    go.addEventListener("click", () => {
      this.#debugCommands(input.value);
      command.remove();
    });

    command.appendChild(input);
    command.appendChild(go);

    this.loc.appendChild(command);
  }

  #debugCommands(input) {
    try {
      if (input !== "" && input !== null) {
        const goto = input.matchAll(/^(\w+)\s(\w+)(?:\s!(\w+))?/gi) ?? null;

        const results = [...goto][0];
        const commandName = results[1];
        const commandValue = results[2];
        const commandParameter = results[3];

        if (
          thisApp.config.commandsEnabled === "false" &&
          commandName !== "config"
        ) {
          return;
        }

        switch (commandName) {
          case "goto":
            this.#goto(commandValue, commandParameter);
            break;
          case "show":
            this.#show(commandValue, commandParameter);
            break;
          case "throw":
            throw commandValue;
          case "config":
            this.#config(commandValue, commandParameter);
            break;
          default:
            throw (
              "command " +
              commandName +
              " not recognised. Valid commands: [goto, show, throw, config]"
            );
        }
      }
    } catch (err) {
      g.catchToDebug("debugCommands", err);
      return;
    }
  }

  #goto(commandValue, commandParameter) {
    switch (commandValue) {
      case "pokemonList":
        thisApp.display.postView(commandValue);
        setTimeout(() => {
          for (let i = 1; i < Number(commandParameter); i++) {
            thisApp.display.currentImport.downEvent();
          }
        }, 600);
        break;
      default:
        thisApp.display.postView(commandValue, commandParameter ?? null);
        break;
    }
  }

  #show(commandValue, commandParameter) {
    thisApp.display.postView("error", [
      `${commandValue}${commandParameter !== undefined ? "." : ""}${
        commandParameter ?? ""
      }`,
      thisApp.display[commandParameter] !== undefined
        ? thisApp.display[commandValue][commandParameter]
        : thisApp.display[commandValue],
    ]);
  }

  #config(commandValue, commandParameter) {
    localStorage.setItem("gameNug" + commandValue, commandParameter);
    thisApp.config[commandValue] = commandParameter;
    this.createDebug("set " + commandValue + " to " + commandParameter);
  }
}
