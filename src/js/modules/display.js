import thisApp from "../init.js";
import g from "./generic.js";

("use strict");

export default class Display {
  element;
  /**
   * @summary The HTML element(s) currently on the display - corresponds to this.currentImport.element
   */
  currentView;
  /**
   * @summary The View instance currently in use by GNE
   */
  currentImport;
  lastError;
  controls = { a: null, b: null, up: null, down: null };

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
    if (this.element.children[0]) {
      this.element.children[0]?.remove();
    }

    if (typeof this.currentView === "string") {
      this.element.innerHTML = this.currentView;
      this.currentView = this.element.children[0];
    } else if (typeof this.currentView === "object") {
      this.element.appendChild(this.currentView);
    }
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

  isMobileView() {
    if (Number(document.documentElement.clientWidth) <= 800) {
      return true;
    }
    return false;
  }

  isMediumView() {
    if (
      !this.isMobileView() &&
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
      this.activeViewName = viewName;
      this.viewParam = param;

      this?.currentImport?.deconstruct();

      const isInternalView = thisApp.views.includes(viewName);

      // We save the current view in a class-scope property so we can handle the corresponding events seperately from any other views that may be being processed --
      if (isInternalView) {
        this.currentImport = await this.getInternalView(viewName, param);
        thisApp.logger.log(`Using internal view protocol`);
      } else {
        this.currentImport = await this.getView(viewName, param);
        thisApp.logger.log(`Using app view protocol`);
      }

      const element = await this.currentImport.build();

      if (!element)
        throw "View build failed - check if your View's HTML method returns an element";

      thisApp.logger.log(`Successfully built view '${viewName}'`);

      if (this.currentImport?.options?.requiresParameter) {
        if (!param)
          throw `View ${element?.id ?? ""} has option requiredParameter enabled, ${typeof param} passed`;
      }

      // --Like this
      this.#write(element);
      this.currentImport.appendEvents();
      thisApp.logger.log(`Appended events for view '${viewName}'`);

      if (this.currentImport.events?.postWrite) {
        this.currentImport.events.postWrite();
        thisApp.logger.log(`Executed postWrite for view '${viewName}'`);
      }

      thisApp.debugHandler.createDebug("posted " + viewName, true);
      thisApp.logger.log("Posted view: '" + viewName + "'");
    } catch (err) {
      if (viewName !== "error") {
        this.postView("error", ["FATAL", err]);
      } else {
        this.element?.children[0].remove();
      }
      thisApp.debugHandler.createDebug("FATAL", true);
      console.error(err);
      return false;
    }
  }

  // I had to split these up the stupid way because import() does not accept any expression as parameter
  // But somehow a template literal is fine
  async getView(viewName, param = null) {
    const imp = await import(`${thisApp.viewDir}/${viewName}.js`);

    return this.#processView(imp, param);
  }

  async getInternalView(viewName, param = null) {
    const imp = await import(`./views/${viewName}.js`);

    return this.#processView(imp, param);
  }

  async #processView(imp, param = null) {
    if (!imp) throw "Invalid View instance passed";

    return typeof imp?.default === "function"
      ? imp.default(param)
      : imp?.default;
  }

  /**
   * @summary Re-posts the current View with its passed parameter
   */
  refresh() {
    if (this?.activeViewName)
      this.postView(this.activeViewName, this?.viewParam ?? null);
  }

  #bindControls(controls = { up, down, a, b }) {
    if (controls?.a) {
      this.controls.a = controls.a;
    }
    if (controls?.b) {
      this.controls.b = controls.b;
    }
    if (controls?.up) {
      this.controls.up = controls.up;
    }
    if (controls?.down) {
      this.controls.down = controls.down;
    }
  }
}
