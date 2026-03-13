import thisApp from "../../init.js";

export default class ListView {
  static listLength = 1;

  static validListPresent() {
    return document.querySelector("ul .activeMenuItem");
  }

  static up() {
    if (selectedMenuItem > 1) {
      selectedMenuItem--;
      ListView.moveMenu();
    }
  }

  static down() {
    if (selectedMenuItem < listLength) {
      selectedMenuItem++;
      ListView.moveMenu();
    }
  }

  static moveMenu() {
    thisApp.debugHandler.createDebug("menu " + selectedMenuItem);
    ListView.applyArrow();
  }

  static applyArrow() {
    document.querySelector(".activeMenuItem")?.removeAttribute("class");
    document
      .querySelector(`#top-panel li:nth-of-type(${selectedMenuItem})`)
      .setAttribute("class", "activeMenuItem");
  }
}
