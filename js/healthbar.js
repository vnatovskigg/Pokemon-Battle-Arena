export default class Healthbar {
  constructor(holder, hp, maxHp, type) {
    this.hp = hp;
    this.maxHp = maxHp;
    this.type = type;
    this.bar = holder.querySelector(".health-bar");
    // this.setValue(100);
  }

  setValue(newValue) {
    if (newValue < 0) {
      newValue = 0;
    }

    if (newValue > 100) {
      newValue = 100;
    }

    this.value = newValue;
  }

  update(damage) {
    this.hp -= damage;
    const percentLeft = (this.hp / this.maxHp) * 100;
    this.setValue(percentLeft);

    this.bar.style.width = this.value + "%";

    if (percentLeft <= 50) {
      this.bar.style["background-color"] = "#f2ba14";
    }

    if (percentLeft <= 10) {
      this.bar.style["background-color"] = "#ce2827";
    }
  }
}
