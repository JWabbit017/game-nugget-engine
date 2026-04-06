import { DHTMLReactiveState, ReactiveSlot, Slot } from "../dhtml.js";
import g from "../generic.js";
import View from "../viewTemplate.js";

class TestView extends View {
  static count = new DHTMLReactiveState("hello");

  constructor() {
    super(TestView.HTML, {
      up: () => {
        TestView.count.value += " hello";
      },
      a: () => {
        Slot.activate(TestView.slotID);
      },
    });
  }

  static HTML() {
    const test = g.newElement("div");
    test.setAttribute("id", "test");

    const header = g.newElement("h2", "Testing View");

    test.appendChild(header);

    const reactive = new ReactiveSlot(TestView.count);
    TestView.slotID = reactive.id;

    test.appendChild(reactive.element);

    return test;
  }
}

export default new TestView();
