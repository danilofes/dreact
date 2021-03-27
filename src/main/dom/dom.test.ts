import { root, $if, $repeat, el, on, text, properties, model } from ".";
import { state } from "../state";

test("static text node", () => {
  const rootEl = createEl('div');
  root(rootEl).children(
    text("static text")
  );

  const actualNode = rootEl.childNodes[0];
  expect(actualNode).not.toBeNull();
  expect(actualNode.nodeType).toBe(Node.TEXT_NODE);
  expect(actualNode.textContent).toBe("static text");
});

test("dynamic text node", () => {
  const rootEl = createEl('div');
  const myString = state("dynamic text");
  root(rootEl).children(
    text(myString)
  );

  const actualNode = rootEl.childNodes[0];
  expect(actualNode.textContent).toBe("dynamic text");

  myString.setValue("new value");
  expect(actualNode.textContent).toBe("new value");
});


test("element nodes with children", () => {
  const rootEl = createEl('div');
  root(rootEl).children(
    el.ul(
      el.li()
    ),
    el.span()
  );

  expect(rootEl.innerHTML).toBe("<ul><li></li></ul><span></span>");
});

test("$if directive", () => {
  const rootEl = createEl('div');
  const condition = state(false);
  root(rootEl).children(
    $if(condition, () =>
      el.span()
    )
  );

  expect(rootEl.innerHTML).toBe("<!--if node-->");

  condition.setValue(true);
  expect(rootEl.innerHTML).toBe("<span></span><!--if node-->");

  condition.setValue(false);
  expect(rootEl.innerHTML).toBe("<!--if node-->");
});

test("$repeat directive", () => {
  const rootEl = createEl('div');
  const fruits = state([{ name: "apple" }, { name: "orange" }]);
  root(rootEl).children(
    $repeat(fruits, (fruit, i) =>
      el.div(
        text`${i}: ${fruit.$.name}`,
        el.button(text("X"), on.click(() => fruits.updater.removeAt(i)))
      )
    )
  );

  expect(rootEl.children.length).toBe(2);
  expect(rootEl.children[0].outerHTML).toBe("<div>0: apple<button>X</button></div>");
  expect(rootEl.children[1].outerHTML).toBe("<div>1: orange<button>X</button></div>");

  fruits.updater.append({ name: "banana" });
  expect(rootEl.children.length).toBe(3);
  expect(rootEl.children[2].outerHTML).toBe("<div>2: banana<button>X</button></div>");

  
  rootEl.children[1].querySelector("button")!.click();

  expect(rootEl.children.length).toBe(2);
  expect(rootEl.children[0].outerHTML).toBe("<div>0: apple<button>X</button></div>");
  expect(rootEl.children[1].outerHTML).toBe("<div>1: banana<button>X</button></div>");
  
  fruits.updater.removeAt(1);

  fruits.setValue([]);
  expect(rootEl.children.length).toBe(0);
});

test("text template tag", () => {
  const rootEl = createEl('div');
  const counter = state(1);

  root(rootEl).children(
    text`the counter is ${counter}`
  );
  expect(rootEl.textContent).toBe("the counter is 1");

  counter.setValue(2);
  expect(rootEl.textContent).toBe("the counter is 2");
});

function createEl(tag: string): HTMLElement {
  return document.createElement(tag);
}