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

  construct = null;
  element = null;

  static app = thisApp;
  static appDisplay = View.app.display;
  static appControls = View.appDisplay.controls;

  options = {
    requiresParameter: false,
    isInternalView: false,
    returnsFunction: false,
  };

  constructor(
    construct = null,
    events = {
      preWrite: null,
      postWrite: null,
      a: null,
      b: null,
      up: null,
      down: null,
      misc: null,
    },
  ) {
    if (construct) this.construct = construct ?? this?.HTML;

    if (events) this.assignEvents(events);
  }

  assignEvents(
    events = {
      preWrite: null,
      postWrite: null,
      a: null,
      b: null,
      up: null,
      down: null,
      misc: null,
    },
  ) {
    if (events) {
      this.events.preWrite = events?.preWrite ?? this?.preWrite;
      this.events.postWrite = events?.postWrite ?? this?.postWrite;
      this.events.a = events?.a ?? this?.aEvent;
      this.events.b = events?.b ?? this?.bEvent;
      this.events.up = events?.up ?? this?.upEvent;
      this.events.down = events?.down ?? this?.downEvent;
      this.events.misc = events?.misc ?? this?.miscEvent;
    }
  }

  async #awaitPreWrite(event) {
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
    if (this.events.preWrite) await this.#awaitPreWrite(this.events.preWrite);

    if (typeof this.construct === "function") {
      this.element = await this.construct();
    } else this.element = this.construct;

    return this.element ?? false;
  }

  appendEvents() {
    if (this.events.a)
      View.appControls.a.addEventListener("click", this.events.a);
    if (this.events.b)
      View.appControls.b.addEventListener("click", this.events.b);

    if (this.events.up)
      View.appControls.up.addEventListener("click", this.events.up);
    if (this.events.down)
      View.appControls.down.addEventListener("click", this.events.down);

    if (this.events.misc)
      document.addEventListener("keydown", (event) => {
        this.events.misc(event);
      });
  }

  removeEvents() {
    // Turns out removeEventListener doesn't really seem to care if the event exists or not, so I can leave out the null checks
    View.appControls.a.removeEventListener("click", this.events.a);
    View.appControls.b.removeEventListener("click", this.events.b);

    View.appControls.up.removeEventListener("click", this.events.up);
    View.appControls.down.removeEventListener("click", this.events.down);

    document.removeEventListener("keydown", (event) => {
      this.events.misc(event);
    });
  }
}
