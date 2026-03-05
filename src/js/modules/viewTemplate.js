import thisApp from "../init.js";
import g from "./generic.js";

export default class View {
  events = {
    preWrite: null,
    postWrite: null,
    a: null,
    b: null,
    up: null,
    down: null,
    misc: null,
  };

  element = null;

  static app = thisApp;
  static appDisplay = View.app.display;
  static appControls = View.appDisplay.controls;

  constructor(
    element,
    events = {
      preWrite: async () => {},
      postWrite: () => {},
      a: () => {},
      b: () => {},
      up: () => {},
      down: () => {},
      misc: () => {},
    },
  ) {
    this.element = element;

    this.events.preWriteEvent = events?.preWriteEvent ?? this?.preWrite;
    this.events.postWriteEvent = events?.postWriteEvent ?? this?.postWrite;
    this.events.aEvent = events?.aEvent ?? this?.aEvent;
    this.events.bEvent = events?.bEvent ?? this?.bEvent;
    this.events.upEvent = events?.upEvent ?? this?.upEvent;
    this.events.downEvent = events?.downEvent ?? this?.downEvent;
    this.events.miscEvents = events?.miscEvent ?? this?.miscEvent;
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
    if (this.events.aEvent)
      View.appControls.a.addEventListener("click", this.events.a);
    if (this.events.bEvent)
      View.appControls.b.addEventListener("click", this.events.b);

    if (this.events.upEvent)
      View.appControls.up.addEventListener("click", this.events.upEvent);
    if (this.events.downEvent)
      View.appControls.down.addEventListener("click", this.events.downEvent);

    if (this.events.miscEvents)
      document.addEventListener("keydown", (event) => {
        this.miscEvents(event);
      });
  }

  removeEvents() {
    // Turns out removeEventListener doesn't really seem to care if the event exists or not, so I can leave out the null checks
    View.appControls.a.removeEventListener("click", this.events.aEvent);
    View.appControls.b.removeEventListener("click", this.events.bEvent);

    View.appControls.up.removeEventListener("click", this.events.upEvent);
    View.appControls.down.removeEventListener("click", this.events.downEvent);

    document.removeEventListener("keydown", (event) => {
      this.miscEvents(event);
    });
  }
}
