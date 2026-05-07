import thisApp from "../init.js";
import g from "./generic.js";

export default class View {
  events = {
    preWrite: null,
    postWrite: null,
    onDeconstruct: null,
    a: null,
    b: null,
    up: null,
    down: null,
    misc: null,
  };

  /**
   * @summary If a function expression is provided instead of an element, it's stored in this variable until this.build() calls it and puts the HTML in this.element
   */
  construct = null;
  /**
   * @summary The HTML Node in use by this View
   */
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
      onDeconstruct: null,
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
      onDeconstruct: null,
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
      this.events.onDeconstruct = events?.onDeconstruct ?? this?.onDeconstruct;
      this.events.a = events?.a ?? this?.aEvent;
      this.events.b = events?.b ?? this?.bEvent;
      this.events.up = events?.up ?? this?.upEvent;
      this.events.down = events?.down ?? this?.downEvent;
      this.events.misc = events?.misc ?? this?.miscEvent;
    }

    for (const event in events) {
      this.events[event] = events[event];
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
      View.appControls.a.addEventListener("click", () => {
        try {
          this.events.a;
        } catch (err) {
          thisApp.error(`${thisApp.display.activeViewName}.aEvent`, err);
        }
      });
    if (this.events.b)
      View.appControls.b.addEventListener("click", () => {
        try {
          this.events.b;
        } catch (err) {
          thisApp.error(`${thisApp.display.activeViewName}.bEvent`, err);
        }
      });

    if (this.events.up)
      View.appControls.up.addEventListener("click", () => {
        try {
          this.events.up;
        } catch (err) {
          thisApp.error(`${thisApp.display.activeViewName}.upEvent`, err);
        }
      });
    if (this.events.down)
      View.appControls.down.addEventListener("click", () => {
        try {
          this.events.down;
        } catch (err) {
          thisApp.error(`${thisApp.display.activeViewName}.downEvent`, err);
        }
      });

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

  deconstruct() {
    this.removeEvents();

    if (this.events.onDeconstruct) this.events.onDeconstruct();

    const nodeRemove = this.element?.remove;

    if (nodeRemove) this.element.remove();
    else
      document.querySelector(`#${thisApp.display?.activeViewName}`)?.remove();

    thisApp.logger.log(
      `View '${thisApp.display?.activeViewName ?? ""}' deconstructed`,
    );
  }
}
