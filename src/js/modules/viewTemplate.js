import thisApp from "../init.js";
import g from "./generic.js";

export default class View {
  aEvent = null;
  bEvent = null;
  upEvent = null;
  downEvent = null;
  miscEvents = null;

  static app = thisApp;
  static appDisplay = View.app.display;
  static appControls = View.appDisplay.controls;

  element = null;

  constructor(element, events = {}) {
    this.element = element;

    this.aEvent = events.aEvent ?? null;
    this.bEvent = events.bEvent ?? null;
    this.upEvent = events.upEvent ?? null;
    this.downEvent = events.downEvent ?? null;
    this.miscEvents = events.miscEvent ?? null;
  }

  appendEvents() {
    if (g.isValidObject(this.aEvent))
      View.appControls.a.addEventListener("click", this.aEvent);
    if (g.isValidObject(this.bEvent))
      View.appControls.b.addEventListener("click", this.bEvent);

    if (this.upEvent !== null)
      View.appControls.up.addEventListener("click", this.upEvent);
    if (this.downEvent !== null)
      View.appControls.down.addEventListener("click", this.downEvent);

    if (this.miscEvents !== null)
      document.addEventListener("keydown", (event) => {
        this.miscEvents(event);
      });
  }

  removeEvents() {
    View.appControls.a.removeEventListener("click", this.aEvent);
    View.appControls.b.removeEventListener("click", this.bEvent);

    View.appControls.up.removeEventListener("click", this.upEvent);
    View.appControls.down.removeEventListener("click", this.downEvent);

    document.removeEventListener("keydown", (event) => {
      this.miscEvents(event);
    });
  }
}
