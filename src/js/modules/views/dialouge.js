import thisApp from "../../init.js";
import g from "../generic.js";
import View from "../viewTemplate.js";

class Dialouge extends View {
  static selectedMenuItem = 1;
  static dialouge;

  constructor(
    dialouge = {
      q: "Default",
      options: {
        Yes: () => {
          thisApp.display.postView("info", "youre did it");
        },
        No: () => {
          thisApp.display.postView("info", "ouch");
        },
      },
    },
  ) {
    const d = dialouge ?? {
      q: "Default",
      options: {
        Yes: () => {
          thisApp.display.postView("info", "dialouge accepted");
        },
        No: () => {
          thisApp.display.postView("info", "dialouge rejected");
        },
      },
    };

    super(Dialouge.HTML(d), {
      a: Dialouge.gotoSelectedOption,
      up: Dialouge.next,
      down: Dialouge.previous,
    });

    Dialouge.dialouge = d;
  }

  static gotoSelectedOption() {
    const name = document
      .querySelector("#dialouge .activeMenuItem")
      .getAttribute("data-option");

    Dialouge.dialouge.options[name]();
  }

  static next() {
    if (Dialouge.selectedMenuItem > 1) Dialouge.selectedMenuItem--;
    Dialouge.moveMenu();
  }

  static previous() {
    if (
      Dialouge.selectedMenuItem < Object.keys(Dialouge.dialouge.options).length
    )
      Dialouge.selectedMenuItem++;
    Dialouge.moveMenu();
  }

  static moveMenu() {
    thisApp.debugHandler.createDebug("option " + Dialouge.selectedMenuItem);
    Dialouge.applyArrow();
  }

  static applyArrow() {
    document.querySelector(".activeMenuItem")?.removeAttribute("class");
    document
      .querySelector(
        `#dialouge footer > div:nth-of-type(${Dialouge.selectedMenuItem})`,
      )
      ?.setAttribute("class", "activeMenuItem");
  }

  static HTML(data) {
    const dialouge = g.newElement("div");
    dialouge.setAttribute("id", "dialouge");

    const q = g.newElement("h2", data.q ?? "ERR");

    const options = g.newElement("footer");

    let i = 0;
    for (const option in data.options) {
      const o = g.newElement("div", option);
      o.setAttribute("data-option", option);
      if (i === 0) o.setAttribute("class", "activeMenuItem");

      options.appendChild(o);
      i++;
    }

    dialouge.appendChild(q);
    dialouge.appendChild(options);

    return dialouge;
  }
}

export default (param = null) => {
  return new Dialouge(param);
};
