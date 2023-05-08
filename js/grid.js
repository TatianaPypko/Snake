import { Manipulator } from "./helpers.js";

export default class extends Manipulator {
  constructor({ boxSize, gridCount, gridContainerSelector, gridCellCssClass }) {
    super();

    this.boxSize = boxSize;
    this.gridCount = gridCount;
    this.gridContainer = this.find(gridContainerSelector);
    this.gridCellCssClass = gridCellCssClass;

    this.#build();
  }

  #build() {
    this.gridContainer.style.width = this.gridContainer.style.height =
      this.boxSize * this.gridCount + "px";

    for (let index = 0; index < this.gridCount; index++) {
      this.gridContainer.append(this.#createRow(index));
    }
  }

  #createRow(row) {
    let fragment = new DocumentFragment();
    for (let index = 0; index < this.gridCount; index++) {
      fragment.append(this.#createCell(row, index));
    }

    return fragment;
  }

  #createCell(row, cell) {
    const div = document.createElement("div");
    div.classList.add(this.gridCellCssClass);
    div.setAttribute("data-cell", cell);
    div.setAttribute("data-row", row);
    div.style.width = div.style.height = this.boxSize + "px";

    return div;
  }
}
