import GNS from "../../../gns/gns.js";
import View from "../viewTemplate.js";
import g from "../generic.js";
import GameNugget from "../../init.js";

export class Terminal extends View {
  commands = [];
  wd = "instance";
  static input;
  static output;
  static previous = "terminal";
  static pile = false;
  static superuser = false;

  constructor() {
    super(Terminal.HTML());

    this.previous = GameNugget.display.currentView?.id ?? "terminal";

    this.assignEvents({
      a: this.run,
      up: this.previousCommand,
      misc: (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          this.run();
        }
      },
    });

    this.clearInput();

    GNS.findWorkingClass(this.wd);
  }

  previousCommand = () => {
    Terminal.input.value = this.commands[this.commands.length - 1];
  };

  run = async () => {
    if (!Terminal.input?.value) return;

    let output;
    if (Terminal.pile)
      Terminal.output.innerHTML += `\n<span class="terminalInput">${Terminal.input.value}</span>\n`;

    Terminal.output.scroll(0, 9999999);

    Terminal.pile
      ? (Terminal.output.innerHTML +=
          "\n<span class='info'>Waiting for asynchronous operation...</span>\n")
      : (Terminal.output.innerHTML =
          "<span class='info'>Waiting for asynchronous operation...</span>\n");

    Terminal.output.scroll(0, 9999999);

    try {
      output = await this.enterCommand(Terminal.input?.value);
    } catch (err) {
      output = "<span class='error'>ERROR: " + err + "</span>";
    } finally {
      if (output)
        Terminal.pile
          ? (Terminal.output.innerHTML += "\n" + output)
          : (Terminal.output.innerHTML = output + "\n");

      Terminal.output.scroll(0, 9999999);

      Terminal.output.innerHTML += output.match("ERROR")
        ? "\n\n<span class='error'>Operation finished with exit code 1</span>\n"
        : "\n\n<span class='success'>Operation finished with exit code 0</span>\n";

      this.clearInput();

      if (Terminal.php)
        document.querySelector("#terminal").setAttribute("data-php", "true");
    }
  };

  clearInput = () => {
    const start = (Terminal.superuser ? "|super~/" : "|~/") + this.wd + ": ";
    Terminal.input.value = start;

    Terminal.output.scroll(0, 9999999);
  };

  evalCommand(value) {
    const cmd =
      value.matchAll(
        /\|(?:super)?\~\/?((?:\w+|\/+)+)\:\s(\w+)(?:\s(.+)?\s?)?(?:--)(?:(.+)){0,}/gi,
      ) ?? null;

    if (!cmd) throw "Unknown command parsing fault";

    const result = [...cmd][0] ?? null;

    if (!result) throw "Cannot parse command: Invalid syntax";

    const full = result[0] ?? null;
    const dir = result[1] ?? null;
    const target = result[2] ?? null;
    const param = result[3] ?? null;
    const optionsFull = result[4] ?? null;
    const force = String(Terminal.superuser) === "true";

    const options = {};

    if (optionsFull) {
      const optionsMatch = optionsFull.matchAll(/(\w+)=(.+)/gi);
      const option = [...optionsMatch][0] ?? null;

      options[option[1]] = option[2];
    }

    if (!dir) throw "Cannot execute command without working directory/class";
    else return [dir, target, param, options, force];
  }

  enterCommand = async (value = "") => {
    this.commands.push(value);
    GameNugget.logger.log("GNS Terminal executed: " + value);

    if (!value.match("--")) value += "--";

    const [dir, target, param, options, force] = this.evalCommand(value);

    this.wd = dir ?? "";

    if (GNS[target])
      return await GNS[target](dir, target, param, options, force);
    else
      throw `Command '${target}' not recognised or not available in '${dir}'`;
  };

  static HTML() {
    const terminal = g.newElement("div");
    terminal.setAttribute("id", "terminal");

    const input = g.newElement("textarea");

    input.setAttribute("rows", "1");
    input.setAttribute("autofocus", "");
    input.setAttribute("spellcheck", "false");

    const output = g.newElement("pre");

    if (GameNugget.config?.retroTerminal === "true") {
      terminal.setAttribute("data-retro", "true");
    }

    terminal.appendChild(input);
    terminal.appendChild(output);

    Terminal.input = input;
    Terminal.output = output;

    return terminal;
  }
}

export default new Terminal();
