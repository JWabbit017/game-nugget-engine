import thisApp from "../init.js";
import g from "./generic.js";

export default class View {
  preWriteEvent = null;
  aEvent = null;
  bEvent = null;
  upEvent = null;
  downEvent = null;
  miscEvents = null;

  static app = thisApp;
  static appDisplay = View.app.display;
  static appControls = View.appDisplay.controls;

  element = null;

  constructor(
    element,
    events = {
      preWriteEvent: async () => {},
      aEvent: () => {},
      bEvent: () => {},
      upEvent: () => {},
      downEvent: () => {},
      miscEvent: () => {},
    },
  ) {
    this.element = element;

    this.preWriteEvent = events?.preWriteEvent;
    this.aEvent = events?.aEvent;
    this.bEvent = events?.bEvent;
    this.upEvent = events?.upEvent;
    this.downEvent = events?.downEvent;
    this.miscEvents = events?.miscEvent;
  }

  async #preWrite(event) {
    try {
      if (typeof event !== "function")
        throw "preWriteEvent was passed but is not a function";

      this.preWriteValue = await event();
    } catch (err) {
      g.catchToDebug("preWrite", err);
      appDisplay.postView("error", ["preWrite", err]);
    }
  }

  async build() {
    if (this.preWriteEvent) await this.#preWrite(this.preWriteEvent);

    this.appendEvents();
  }

  appendEvents() {
    if (this.aEvent) View.appControls.a.addEventListener("click", this.aEvent);
    if (this.bEvent) View.appControls.b.addEventListener("click", this.bEvent);

    if (this.upEvent)
      View.appControls.up.addEventListener("click", this.upEvent);
    if (this.downEvent)
      View.appControls.down.addEventListener("click", this.downEvent);

    if (this.miscEvents)
      document.addEventListener("keydown", (event) => {
        this.miscEvents(event);
      });
  }

  removeEvents() {
    // Turns out removeEventListener doesn't really seem to care if the event exists or not, so I can leave out the null checks
    View.appControls.a.removeEventListener("click", this.aEvent);
    View.appControls.b.removeEventListener("click", this.bEvent);

    View.appControls.up.removeEventListener("click", this.upEvent);
    View.appControls.down.removeEventListener("click", this.downEvent);

    document.removeEventListener("keydown", (event) => {
      this.miscEvents(event);
    });
  }
}
