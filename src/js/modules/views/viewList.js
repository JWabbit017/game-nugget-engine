import thisApp from "../../init.js";

export default class ListPreset {
  listLength = 1;

  static upEvent() {
    if (selectedMenuItem > 1) selectedMenuItem--;
    moveMenu();
  }

  static downEvent() {
    if (selectedMenuItem < listLength) selectedMenuItem++;
    moveMenu();
  }

  static moveMenu() {
    thisApp.debugHandler.createDebug("menu " + selectedMenuItem);
    applyArrow();
  }

  static applyArrow() {
    document.querySelector(".activeMenuItem").removeAttribute("class");
    document
      .querySelector(`#top-panel li:nth-of-type(${selectedMenuItem})`)
      .setAttribute("class", "activeMenuItem");
  }
}
