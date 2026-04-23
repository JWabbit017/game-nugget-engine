import g from "./generic.js";

/**
 * @summary Class providing common functionality for DHTML Slots - a toggleable element containing a runtime variable in DOM
 */
export class Slot {
  innerElement;
  element;
  id;

  /**
   * @summary Create a new Slot with a given element and options
   * @param {Element} el The Element/Node to wrap inside the Slot
   * @param {Object} options { activeByDefault: boolean }
   * @returns The Slot instance created. Access the Slot element by this.element and the ID by this.id
   */
  constructor(el, options = { active: false }) {
    this.innerElement = el;
    this.id = this.newSlotID();

    this.element = this.slot(this.innerElement, this.id);

    if (options?.active) this.activate;

    return this;
  }

  /**
   * @returns If it exists, the Slot element corresponding to id
   */
  static getSlot(id) {
    return document.querySelector(`*[data-slot="${id}"]`);
  }

  /**
   * @summary Replaces the id's Slot container with its content and removes its display:none rule
   */
  static activate(id) {
    const slot = Slot.getSlot(id);

    if (!slot) {
      throw "No slot assigned for element " + id;
    }

    slot.replaceWith(slot.children[0]);
  }

  /**
   * @summary Replaces the Slot container with its content and removes its display:none rule
   */
  activate() {
    this.element.replaceWith(this.innerElement);
  }

  newSlotID() {
    return String(Math.floor(Math.random() * 99999)).padStart(5, "0");
  }

  /**
   * @param {Element} el
   * @param {Number|null} id
   * @returns {Element} The newly created Slot container with the innerElement as its only child
   */
  slot(el, id = null) {
    let thisId;

    if (!id) {
      thisId = newSlotID();
    } else {
      thisId = id;
    }

    this.id = id;

    el.setAttribute("data-slot", thisId);

    const slotEl = document.createElement("aside");
    slotEl.setAttribute("data-slot", thisId);
    slotEl.setAttribute("data-inactive", "true");

    slotEl.appendChild(el);

    return slotEl;
  }
}

/**
 * @summary Provides Slot functionality with a DHTML reactive value as its content
 * @returns The ReactiveSlot instance created. Access the Slot element by this.element and the ID by this.id
 */
export class ReactiveSlot extends Slot {
  /**
   * @param {DHTMLReactiveState} state The DHTML Reactive state to use as the Slot's content - note that the state's value must be appendable to the DOM as a string OR return an appendable string if the state is a function
   * @returns
   */
  constructor(state, slotOptions = {}) {
    const element = g.newElement("div", String(state.value));

    super(element, slotOptions);

    if (!(state instanceof DHTMLReactiveState))
      throw "Reactive slots must be assigned a DHTMLReactiveState instance";

    this.state = state;

    this.state.update = () => {
      this.innerElement.innerHTML = this.state.value;
    };

    return this;
  }
}

/**
 * @summary Provides basic reactivity to a value of any type - note that passing a function will store its return value
 *
 * - In order to make use of the reactive value you must extend this class and define its update method - this will be called on a value change
 */
export class DHTMLReactiveState {
  #value;

  constructor(value) {
    this.value = value;
  }

  set value(newValue) {
    this.#value = typeof newValue === "function" ? newValue() : newValue;
    if (this?.update) this.update();
  }

  get value() {
    return this.#value;
  }
}
