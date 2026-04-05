import GameNugget from "../init.js";

export function onEvent(el, viewEvent) {
  if (!GameNugget.display.controls[viewEvent])
    throw viewEvent + " is not a valid or bound control";

  const id = slotID();

  GameNugget.display.controls[viewEvent].addEventListener("click", () => {
    activateSlot(id);
  });

  return slot(el, id);
}

export function activateSlot(id) {
  const slot = GameNugget.display.currentView?.querySelector(
    `[data-slot="${id}"]`,
  );

  if (!slot) {
    GameNugget.logger.log("Slot element created without valid slot in DOM");
    throw "No slot assigned for element " + id;
  }

  slot.replaceWith(slot.children[0]);
}

export function slotID() {
  return String(Math.floor(Math.random() * 99999)).padStart(5, "0");
}

export function slot(el, id = null) {
  let thisId;

  if (!id) {
    thisId = slotID();
  } else {
    thisId = id;
  }

  el.setAttribute("data-slot", thisId);

  const slotEl = document.createElement("aside");
  slotEl.setAttribute("data-slot", thisId);
  slotEl.setAttribute("data-inactive", "true");

  slotEl.appendChild(el);

  return slotEl;
}
