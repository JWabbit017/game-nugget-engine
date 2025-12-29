import { thisApp } from "../../script.js";
import g from "../generic.js";
import View from "../viewTemplate.js";

let pokemonListPage;
let selectedPokemonIndex;
let selecting;
let listPageWidth;
let pokemonPerPage;

// Initialising function - see this as the constructor of the view
export default function pokemonList() {
  pokemonListPage = 1;
  selecting = false;
  selectedPokemonIndex = 0;

  listPageWidth = thisApp.display.viewType();
  pokemonPerPage = listPageWidth * listPageWidth;

  const thisHTML = HTML(thisApp.pokemon);

  const view = new View(thisHTML, {
    aEvent: aEvent,
    bEvent: bEvent,
    upEvent: upEvent,
    downEvent: downEvent,
    miscEvents: miscEvent,
  });

  view.aEvent2 = aEvent2;
  view.upEvent2 = upEvent2;
  view.downEvent2 = downEvent2;

  return view;
}

function getSelectorPosition() {
  return (
    pokemonListPage * listPageWidth - (listPageWidth - 1) + selectedPokemonIndex
  );
}

function upEvent() {
  if (!selecting) {
    thisApp.display.scrollVertical(-1);
    pokemonListPage > 1 ? pokemonListPage-- : false;
  } else {
    upEvent2();
  }
  thisApp.debugHandler.createDebug(
    `slot [${pokemonListPage},${selectedPokemonIndex}]`
  );
}

function upEvent2() {
  document.querySelector(".selected").removeAttribute("class");

  selectedPokemonIndex > 0 ? selectedPokemonIndex-- : false;
  document
    .querySelector(
      `#pokemonList > div:nth-of-type(${getSelectorPosition()}) img`
    )
    .setAttribute("class", "selected");
}

function downEvent() {
  if (!selecting) {
    thisApp.display.scrollVertical(1);
    pokemonListPage < 297 ? pokemonListPage++ : false;
  } else {
    downEvent2();
  }
  thisApp.debugHandler.createDebug(
    `slot [${pokemonListPage},${selectedPokemonIndex}]`
  );
}

function downEvent2() {
  document.querySelector(".selected").removeAttribute("class");

  selectedPokemonIndex < pokemonPerPage - 1 ? selectedPokemonIndex++ : false;
  document
    .querySelector(
      `#pokemonList > div:nth-of-type(${getSelectorPosition()}) img`
    )
    .setAttribute("class", "selected");
}

function aEvent() {
  if (!selecting) {
    const currentTopLeftIndex =
      pokemonListPage * listPageWidth - (listPageWidth - 1);

    document
      .querySelector(
        `#pokemonList > div:nth-of-type(${currentTopLeftIndex}) img`
      )
      .setAttribute("class", "selected");

    selectedPokemonIndex = 0;
    selecting = true;
    return;
  } else {
    aEvent2();
  }
}

function aEvent2() {
  thisApp.display.postView("pokemonBio", getSelectorPosition());

  selecting = false;
}

function bEvent() {
  if (!selecting) {
    thisApp.display.postView("mainMenu", null);
  } else {
    document.querySelector(".selected").removeAttribute("class");
    selecting = false;
  }
}

function miscEvent(event) {
  switch (event.key) {
    case "ArrowUp":
      thisApp.display.scrollVertical(-1);
      pokemonListPage > 1 ? pokemonListPage-- : false;
      break;
    case "ArrowDown":
      thisApp.display.scrollVertical(1);
      pokemonListPage < 319 ? pokemonListPage++ : false;
      break;
  }
}

function HTML(data) {
  const sideBar = document.createElement("nav");

  sideBar.setAttribute("id", "pokemonList");

  for (const pokemon of data) {
    const tile = g.newElement("div");
    const fig = g.newElement("figure");
    const img = g.newElement("img");
    const caption = g.newElement("figcaption");

    img.setAttribute("src", pokemon.spriteFront);
    img.setAttribute("alt", "pokemon " + pokemon.id);
    caption.append(
      document.createTextNode(`#${String(pokemon.id).padStart(3, "0")}`)
    );

    fig.appendChild(img);
    fig.appendChild(caption);

    tile.appendChild(fig);

    sideBar.appendChild(tile);
  }

  return sideBar;
}
