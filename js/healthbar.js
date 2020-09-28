import { drawHealthbar, createHTMLElement } from "./utils.js";

export default class Healthbar {
  constructor(holder, hp, maxHp, type) {
    this.hp = hp;
    this.maxHp = maxHp;
    this.type = type;
    this.bar = createHTMLElement("canvas");
    this.ctx = this.bar.getContext("2d");
    this.holder = holder;
    // this.setValue(100);
  }

  initiate() {
    this.bar.width = 130;
    this.bar.height = 15;

    this.holder.appendChild(this.bar);
    drawHealthbar(
      this.ctx,
      0,
      0,
      this.bar.width,
      this.bar.height,
      this.hp,
      this.maxHp
    );
  }

  update(damage) {
    this.hp -= damage;

    setTimeout(() => {
      drawHealthbar(
        this.ctx,
        0,
        0,
        this.bar.width,
        this.bar.height,
        this.hp,
        this.maxHp
      );
    }, 1600);
  }
}
