import thisApp from "../../init.js";
import View from "../viewTemplate.js";

class Info extends View {
  constructor(text) {
    const previous = thisApp.display.currentImport;

    super(Info.HTML(text));

    setTimeout(() => {
      thisApp.display.postView(previous.element.getAttribute("id"));
    }, 2000);
  }

  static HTML(text) {
    return `
      <div id="info">
        <h2>${text}</h2>
      </div>
    `;
  }
}

export default (param) => {
  return new Info(param);
};
