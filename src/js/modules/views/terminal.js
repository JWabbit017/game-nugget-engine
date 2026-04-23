import GNS from "../../../gns/gns.js";
import View from "../viewTemplate.js";
import g from "../generic.js";
import GameNugget from "../../init.js";

export class Terminal extends View {
  commands = [];
  wd = "instance";
  static input;
  static output;
  static previous = "defaultView";
  static pile = false;

  constructor() {
    super(Terminal.HTML());

    this.previous = GameNugget.display.currentView?.id ?? "defaultView";

    this.assignEvents({
      a: this.run,
      up: this.previousCommand,
    });

    this.clearInput();

    GNS.findWorkingClass(this.wd);
  }

  previousCommand = () => {
    Terminal.input.value = this.commands[this.commands.length - 1];
  };

  run = async () => {
    let output;
    try {
      output = await this.enterCommand(Terminal.input?.value);
    } catch (err) {
      output = "<span class='error'>ERROR: " + err + "</span>";
    } finally {
      if (output)
        Terminal.pile
          ? (Terminal.output.innerHTML +=
              `\n\n<span class="terminalInput">${Terminal.input.value}</span>\n\n` +
              output)
          : (Terminal.output.innerHTML = output);
      this.clearInput();
    }
  };

  clearInput = () => {
    const start = "|~/" + this.wd + ": ";
    Terminal.input.value = start;
  };

  evalCommand(value) {
    const cmd =
      value.matchAll(
        /\|\~\/?((?:\w+|\/+)+)\:\s(\w+)(?:\s(\w+))?(?:\s(.+))?/gi,
      ) ?? null;

    if (!cmd) throw "Unknown command parsing fault";

    const result = [...cmd][0] ?? null;

    if (!result) throw "Cannot parse command with working directory or class";

    const full = result[0] ?? null;
    const dir = result[1] ?? null;
    const target = result[2] ?? null;
    const param = result[3] ?? null;
    const options = result[4] ?? null;

    if (!dir) throw "Cannot execute command without working directory/class";
    else return [dir, target, param, options];
  }

  enterCommand = async (value = "") => {
    this.commands.push(value);
    GameNugget.logger.log("GNS Terminal executed: " + value);

    const [dir, target, param, options] = this.evalCommand(value);

    this.wd = dir ?? "";

    if (GNS[target]) return await GNS[target](dir, target, param, options);
    else
      throw `Command '${target}' not recognised or not available in '${dir}'`;
  };

  static HTML() {
    const terminal = g.newElement("div");
    terminal.setAttribute("id", "terminal");

    const input = g.newElement("textarea");

    input.setAttribute("rows", "5");
    input.setAttribute("autofocus", "");
    input.setAttribute("spellcheck", "false");

    const output = g.newElement("pre");

    terminal.appendChild(input);
    terminal.appendChild(output);

    Terminal.input = input;
    Terminal.output = output;

    return terminal;
  }
}

export default new Terminal();
