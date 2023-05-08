export class Manipulator {
  find(selector, container = document) {
    let found = container.querySelectorAll(selector);

    return found.length === 1 ? found[0] : found;
  }
}

export const DIRECTIONS = {
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
  DOWN: "down",
};
