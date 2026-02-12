import thisApp from "../init.js";
import g from "./generic.js";

("use strict");

export default class Display {
  element;
  currentView;
  currentImport;
  lastError;
  controls = {};

  // --- CONSTRUCTOR

  /**
   * @param {object} place The HTML node to append the display to.
   * @param {string} initialView The viewName of the view that should be pre-loaded on construction.
   */
  constructor(place = null) {
    this.#createDisplay(place ?? document.querySelector("#top-panel"));
    this.#bindControls({
      up: document.querySelector("#up"),
      down: document.querySelector("#down"),
      a: document.querySelector("#a"),
      b: document.querySelector("#b"),
    });
  }

  preload(view) {
    this.postView(view);
  }

  // --- DISPLAY MANAGEMENT

  #createDisplay(place) {
    this.element = document.createElement("div");
    this.element.setAttribute("class", "display");

    place.appendChild(this.element);
  }

  /**
   * @summary In charge of inserting the view's node into the display.
   */
  #appendView() {
    if (g.isValidObject(this.element.children[0])) {
      this.element.children[0].remove();
    }
    this.element.appendChild(this.currentView);
  }

  /**
   * @summary Writes a new view to the class' internals and then appends it to the DOM.
   * @param {object} view The view to write to the display.
   */
  #write(view) {
    try {
      this.currentView = view;
      this.#appendView();
    } catch (err) {
      g.catchToDebug("write", err);
      return;
    }
  }

  /**
   * @summary Scrolls the current view(!) by -parameter- * -height of the display-. Use negative values to scroll up and vice-versa.
   * @param {number} amount
   */
  scrollVertical(amount) {
    const displayHeight = document.documentElement.clientHeight * 0.45;

    this.currentView.scrollBy(0, displayHeight * amount);
  }

  /**
   * @summary Returns a number corresponding to the current view mode of the browser. Returns 2 for mobile views, and 3 for tablet/desktop.
   * @returns {number} 2 | 3
   */
  viewType() {
    if (this.#isMobileView() && !this.#isMediumView()) {
      return 2;
    } else {
      return 3;
    }
  }

  #isMobileView() {
    return Number(document.documentElement.clientWidth) <= 800 ? true : false;
  }

  #isMediumView() {
    if (
      !this.#isMobileView() &&
      Number(document.documentElement.clientWidth <= 1420)
    ) {
      return true;
    }
    return false;
  }

  // --- VIEW MANAGEMENT

  /**
   * @summary Fetches an external view file, appends its events and writes it to the display. Note: This method is the backbone of the app, and as such any error within it will terminate the display to prevent recursion.
   * @param {string} viewName The name of the view.
   * @param {any} param Will be passed to the view's initialiser function if applicable. Defaults to null.
   */
  async postView(viewName, param = null) {
    try {
      // If the previous view had events, remove them
      if (this.currentImport?.removeEvents) {
        this.currentImport.removeEvents();
      }

      const isInternalView = thisApp.views.includes(viewName);

      // We save the current view in a class-scope property so we can handle the corresponding events seperately from any other views that may be being processed --
      if (isInternalView) {
        this.currentImport = await this.#getInternalView(viewName, param);
      } else {
        this.currentImport = await this.#getView(viewName, param);
      }

      // --Like this
      if (this.currentImport.appendEvents) {
        this.currentImport.appendEvents();
      }

      this.#write(this.currentImport.element);

      thisApp.debugHandler.createDebug("posted " + viewName, true);
    } catch (err) {
      if (viewName !== "error") {
        this.postView("error", ["FATAL", err]);
        console.error(err);
      } else {
        this.currentImport.element.remove();
        console.error(err);
      }
      thisApp.debugHandler.createDebug("FATAL", true);
    }
  }

  // I had to split these up the stupid way because import() does not accept any expression as parameter
  // But somehow a template literal is fine
  async #getView(viewName, param = null) {
    const imp = await import(`${thisApp.viewDir}/${viewName}.js`);

    return this.#processView(imp, param);
  }

  async #getInternalView(viewName, param = null) {
    const imp = await import(`./views/${viewName}.js`);

    return this.#processView(imp, param);
  }

  async #processView(imp, param) {
    if (!imp) throw "Invalid View instance passed";

    return typeof imp?.default === "function"
      ? imp.default(param)
      : imp?.default;
  }

  #bindControls(controls = { up, down, a, b }) {
    if (g.isValidObject(controls.a)) {
      this.controls.a = controls.a;
    }
    if (g.isValidObject(controls.b)) {
      this.controls.b = controls.b;
    }
    if (g.isValidObject(controls.up)) {
      this.controls.up = controls.up;
    }
    if (g.isValidObject(controls.down)) {
      this.controls.down = controls.down;
    }
  }
}
