import thisApp from "../../init.js";
import View from "../viewTemplate.js";
import g from "../generic.js";

// Initialising function - see this as the constructor of the view
export default function info(text, duration = 2000) {
  const previous = thisApp.display.currentImport;

  const view = new View(HTML(text));

  setTimeout(() => {
    thisApp.display.postView(previous.element.getAttribute("id"));
  }, duration);

  return view;
}

function HTML(text) {
  const errorContainer = g.newElement("div");
  errorContainer.setAttribute("id", "info");

  const infoText = g.newElement("p", text);

  errorContainer.appendChild(infoText);

  return errorContainer;
}
