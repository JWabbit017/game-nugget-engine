import { thisApp } from "../script.js";

export default class g {
  /**
   * @param {any} input
   * @returns {boolean} True if input is not null and not undefined, else returns false.
   */
  static isValidObject(input) {
    if (input !== undefined && input !== null) {
      return true;
    }
    return false;
  }

  static isValidNumber(input) {
    if (!isNaN(input) && isFinite(input)) {
      return true;
    }
    return false;
  }

  /**
   * @param {string} el The name of the element to create.
   * @param {string} content The text content to append if applicable.
   * @returns {Node}
   */
  static newElement(el, content = null) {
    const newEl = document.createElement(el);
    content !== null ? newEl.append(document.createTextNode(content)) : false;

    return this.isValidObject(newEl) ? newEl : false;
  }

  /**
   * @summary Applies in-engine exception handling to an Error.
   * @param {string} funcName The name of the function where the exception originated.
   * @param {Error} err The full error passed to the catch block.
   */
  static catchToDebug(funcName, err) {
    thisApp.debugHandler.createDebug(funcName + " error");
    thisApp.display.lastError = err;
  }
}
