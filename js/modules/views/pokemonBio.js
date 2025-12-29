import { thisApp } from "../../script.js";
import View from "../viewTemplate.js";
import g from "../generic.js";

let thisPokemon;

// Initialising function - see this as the constructor of the view
export default async function pokemonBio(id) {
  thisPokemon = thisApp.pokemon[id - 1];

  if (!g.isValidObject(thisPokemon.abilities)) {
    await thisPokemon.getExtendedData();
  }

  const output = new View(HTML(), {
    bEvent: bEvent,
    upEvent: upEvent,
    downEvent: downEvent,
  });

  return output;
}

function bEvent() {
  thisApp.display.postView("pokemonList", thisApp.pokemon);
}

function downEvent() {
  if (thisApp.display.viewType() === 2) {
    thisApp.display.scrollVertical(0.3);
  }
}

function upEvent() {
  if (thisApp.display.viewType() === 2) {
    thisApp.display.scrollVertical(-0.3);
  }
}

function HTML() {
  const pokemonBio = g.newElement("div");
  pokemonBio.setAttribute("id", "pokemonBio");

  const header = g.newElement("header", null);

  const id = g.newElement(
    "span",
    "#" + String(thisPokemon.id).padStart(3, "0")
  );
  const name = g.newElement("h2", thisPokemon.name.toUpperCase());
  let star = null;
  if (thisPokemon.is_legendary) {
    star = g.newElement("span", "*");
  }

  const divider = g.newElement("hr", null);

  const main = g.newElement("main", null);

  const imageFront = g.newElement("img");
  imageFront.setAttribute("class", "display-filter");
  imageFront.setAttribute("src", thisPokemon.spriteFront);

  const description = g.newElement("p", thisPokemon.description);

  const miscInfo = g.newElement("section", null);
  const weight = g.newElement(
    "span",
    "Weight: " + thisPokemon.weight / 10 + "kg"
  );
  const height = g.newElement(
    "span",
    "Height: " + thisPokemon.height / 10 + "m"
  );

  const divider2 = g.newElement("hr", null);

  header.appendChild(id);
  header.appendChild(name);
  if (g.isValidObject(star)) header.appendChild(star);

  main.appendChild(imageFront);
  main.appendChild(description);

  miscInfo.appendChild(weight);
  miscInfo.appendChild(height);

  pokemonBio.appendChild(header);
  pokemonBio.appendChild(divider);
  pokemonBio.appendChild(main);
  pokemonBio.appendChild(divider2);
  pokemonBio.appendChild(miscInfo);

  return pokemonBio;
}
