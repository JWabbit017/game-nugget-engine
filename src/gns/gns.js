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
options: ${options ?? "none"};`;
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

  static goto(dir, target, param, options) {
    GameNugget.display.postView(param, options ?? null);
  }

  static set(dir, target, param, options) {
    console.log(param);
    if (GNS.wd[param] && options) {
      GNS.wd[param] = options;
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
      return String(await GNS.wd[param](options ?? null)) ?? "void";
    } else throw `${param} is not a function in this working space`;
  }

  static d(dir, target, param, options) {
    GameNugget.display.currentImport.wd = param ?? "";
    GNS.updateDir();
  }

  static ad(dir, target, param, options) {
    GameNugget.display.currentImport.wd += "/" + param ?? "";
    GNS.updateDir();
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
    Terminal.pile = true;
    return "Output piling enabled";
  }

  static v() {
    return String(pkg.version);
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

Keywords:
- instance: setting this as your working class enables you to act on the runtime Game Nugget
    `;
  }
}
