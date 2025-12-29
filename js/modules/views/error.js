import { thisApp } from "../../script.js";
import View from "../viewTemplate.js";
import g from "../generic.js";

// Initialising function - see this as the constructor of the view
export default function error(err) {
  const view = new View(HTML(err), { bEvent: bEvent });

  return view;
}

function bEvent() {
  thisApp.display.postView("mainMenu", null);
}

function HTML(err) {
  const errorContainer = g.newElement("div");
  errorContainer.setAttribute("id", "error");

  const errorText = g.newElement("h2", `${err[0]}: ` + err[1]);

  const subtext = g.newElement("p", "Press B to reset the device.");

  errorContainer.appendChild(errorText);
  errorContainer.appendChild(subtext);

  return errorContainer;
}
