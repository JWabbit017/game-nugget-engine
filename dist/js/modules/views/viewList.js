import thisApp from "../../init.js";

export default class ListPreset {
  listLength = 1;

  static upEvent() {
    if (selectedMenuItem > 1) {
      selectedMenuItem--;
      this.moveMenu();
    }
  }

  static downEvent() {
    if (selectedMenuItem < listLength) {
      selectedMenuItem++;
      this.moveMenu();
    }
  }

  static moveMenu() {
    thisApp.debugHandler.createDebug("menu " + selectedMenuItem);
    this.applyArrow();
  }

  static applyArrow() {
    document.querySelector(".activeMenuItem").removeAttribute("class");
    document
      .querySelector(`#top-panel li:nth-of-type(${selectedMenuItem})`)
      .setAttribute("class", "activeMenuItem");
  }
}
