import GameNugget from "../js/init.js";
import * as GNE from "../index.js";
import pkg from "../../package.json" with { type: "json" };
import { Terminal } from "../js/modules/views/terminal.js";

// This is abhorrent code but I don't give a shit anymore
export default class GNS {
  static wd;

  static debug(dir, target, param, options) {
    return `
dir: ${dir}; 
target: ${target ?? "none"};
param: ${param ?? "none"}; 
options: ${JSON.stringify(options) ?? "none"};`;
  }

  static findWorkingClass(dir) {
    const result = dir.split("/");

    if (result[0] ?? "" === "instance") GNS.wd = GameNugget;
    else GNS.wd = GNE;

    if (result[1]) {
      GNS.wd = GNS.wd[result[1]];
      if (!GNS.wd)
        throw `${result[1]} does not exist in working class ${result[0]}`;
    }

    if (result[2]) {
      GNS.wd = GNS.wd[result[2]];
      if (!GNS.wd)
        throw `${result[2]} does not exist in working class ${result[1]}`;
    }
  }

  static config(dir, target, param, options, force = false) {
    const optionName = Object.keys(options)[0] ?? null;
    const optionValue = Object.values(options)[0] ?? null;

    switch (param) {
      case "set":
        if (optionName && (GameNugget.config[optionName] || force)) {
          GameNugget.setOption(optionName, optionValue);
          return `Set option ${optionName} to value ${optionValue}`;
        } else {
          throw `Option ${optionName} does not exist; if you want to create a new option you must be a superuser`;
        }
      case "get":
        if (GameNugget.config[optionName]) {
          return optionName + ": " + GameNugget.config[optionName];
        } else {
          throw `Option ${optionName} does not exist`;
        }
      default:
        throw `${param} is not a valid config operation`;
    }
  }

  static goto(dir, target, param, options) {
    GameNugget.display.postView(
      param,
      options?.view ?? Object.values(options)[0] ?? null,
    );
  }

  static set(dir, target, param, options) {
    if (GNS.wd[param] && (options?.value ?? Object.values(options)[0])) {
      GNS.wd[param] = options?.value ?? Object.values(options)[0];
    } else {
      throw "Set operation failed";
    }
  }

  static access(dir, target, param, options) {
    if (GNS.wd[param]) {
      switch (typeof GNS.wd[param]) {
        case "object":
          return JSON.stringify(GNS.wd[param]);
        default:
          return GNS.wd[param];
      }
    } else {
      throw `Property ${param} does not exist in this working space`;
    }
  }

  static async exec(dir, target, param, options) {
    if (typeof GNS.wd[param] === "function") {
      return (
        String(
          await GNS.wd[param](
            options?.method ?? Object.values(options)[0] ?? null,
          ),
        ) ?? "void"
      );
    } else throw `${param} is not a function in this working space`;
  }

  static d(dir, target, param, options) {
    GameNugget.display.currentImport.wd = param ?? "";
    GNS.updateDir();
    return "OK";
  }

  static ad(dir, target, param, options) {
    GameNugget.display.currentImport.wd += "/" + param ?? "";
    GNS.updateDir();
    return "OK";
  }

  static pp(dir) {
    let list = new String("Properties of " + dir + ": \n");

    for (const property in GNS.wd) {
      list += `----PROPERTY [${property}]: ${typeof GNS.wd[property]}\n`;
    }

    return list;
  }

  static pm(dir) {
    let list = new String("Methods of " + dir + ": \n");

    for (const method of Object.getOwnPropertyNames(
      Object.getPrototypeOf(GNS.wd),
    )) {
      list += `----METHOD [${method}]: ${typeof GNS.wd[method]} \n`;
    }

    return list;
  }

  static pd(dir) {
    return GNS.pp(dir) + "\n" + GNS.pm(dir);
  }

  static updateDir() {
    GNS.findWorkingClass(GameNugget.display.currentImport.wd);
    GameNugget.display.currentImport.clearInput();
    return "";
  }

  static pile() {
    Terminal.pile = !Terminal.pile;
    return `Output piling set to ${Terminal.pile}`;
  }

  static js(dir, target, param) {
    return eval(param);
  }

  static async php(dir, target, param, options, force) {
    if (force) {
      const response = await fetch("./src/gns/php_raw.php", {
        method: "POST",
        body: param,
      });

      return await response.text();
    } else {
      throw "You must be a superuser to execute PHP";
    }
  }

  static async sculpt(dir, target, param, options, force) {
    if (force) {
      const response = await fetch("./src/gns/sculpt_view.php", {
        method: "POST",
        body: JSON.stringify({
          path: param,
          name: options?.name ?? Object.values(options)[0],
        }),
      });

      return await response.text();
    } else {
      throw "You must be a superuser to execute PHP";
    }
  }

  static async dpack(dir, target, param, options, force) {
    if (force) {
      Terminal.output.innerHTML +=
        '<br><span class="warn">[ DPack v0.1.2 by JM ]</span><br>';

      const response = await fetch("./src/gns/dpack.php", {
        method: "POST",
        body: JSON.stringify({ v: param, path: Object.values(options)[0] }),
      });

      return await response.text();
    } else {
      throw "You must be a superuser to execute PHP";
    }
  }

  static echo(dir, target, param) {
    return param;
  }

  static v() {
    return String(pkg.version);
  }

  static mode(dir, target, param, options) {
    switch (param) {
      case "set":
        Terminal[Object.keys(options)[0]] = Object.values(options)[0];
        return `Terminal mode ${Object.keys(options)[0]} set to ${Object.values(options)[0]}`;
      default:
        throw `${param} is not a valid mode operation`;
    }
  }

  static info() {
    return `
GNE v${pkg.version};
Using shell: 'GNS' (default);
Using display handler: 'GNE.Display' (default);
Using view handler: 'GNE.View' (default);
`;
  }

  static help() {
    return `
Please refer to the online GNE docs ('https://rjanszen.reawebdev.nl/GNE') for more detailed documentation.

Common commands:
- d {input}: sets working class to {input}
- ad {input}: appends working class with /{input}
- info: device/library info
- access {input}: print the value of a property {input} of the working class 
- goto {input}: post view {input} of directory Device.viewDir
- exec {input}: call method {input} of working class
- pp: print all non-method properties of working class
- pm: print all methods of working class
- pd: print all properties of working class
- config {input} [superuser]: access/set GNE options
- mode {input}: set terminal modes such as superuser
- js {input}: execute inline js
- php {input} [superuser]: execute inline php
- sculpt {input} [superuser]: sculpt a new OOP view
- pile: enable output piling

Keywords:
- instance: setting this as your working class enables you to act on the runtime Game Nugget
    `;
  }
}
