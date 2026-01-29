import thisApp from "../../../init.js";
import View from "../../viewTemplate.js";
import g from "../../generic.js";

// You can declare variables here for your event- and/or initialiser functions if you need; they only reach as far as the global scope of the view file.

// Initialising function - see this as the constructor of the view
export default function stencil() {
  // The View class does most of the work here - you just need to pass it the view's HTML node and the event functions.
  const view = new View(HTML(), {
    aEvent: aEvent,
    bEvent: bEvent,
    upEvent: upEvent,
    downEvent: downEvent,
  });
  // It is recommended to remove the event functions and parameters for the inputs you don't use in this view, for this stencil however they are all included.
  // At this point, you could seperately define properties for extra functions related to events or whatnot.

  return view; // Important to make sure that you're returning the instance, this contains required methods for the display to function.
}

// These event functions will be called when their corresponding input is pressed while this view is active. They will be wiped from the DOM once a new view gets posted.

function aEvent() {
  return;
}

function bEvent() {
  return;
}

function upEvent() {
  return;
}

function downEvent() {
  return;
}

function HTML() {
  const element = g.newElement("div", "This is the view stencil");
  element.setAttribute("id", "stencil"); // This is required, as all post-write display functions will use the id attribute to determine what view they're dealing with.

  return element;
}
