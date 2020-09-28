import Healthbar from "./healthbar.js";
import { createHTMLElement, appendChildrenToParent } from "./utils.js";

export default class Player {
  constructor(data, type) {
    this.hp = data.stats.find((stat) => stat.stat.name === "hp").base_stat;
    this.maxHp = data.stats.find((stat) => stat.stat.name === "hp").base_stat;
    this.dmg = data.stats.find((stat) => stat.stat.name === "attack").base_stat;
    this.def = data.stats.find(
      (stat) => stat.stat.name === "defense"
    ).base_stat;
    this.speed = data.stats.find(
      (stat) => stat.stat.name === "speed"
    ).base_stat;
    this.sprite =
      type === "enemy" ? data.sprites.front_default : data.sprites.back_default;
    this.name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    this.type = type;
    this.hitSound = new Audio("../assets/hit.wav");
  }

  renderPlayer() {
    const holder = createHTMLElement("div", "player");
    const nameHolder = createHTMLElement("h4", null, this.name);

    const healthbarHolder = createHTMLElement(
      "div",
      `health-bar-holder-${this.type}`
    );

    this.healthbar = new Healthbar(
      healthbarHolder,
      this.hp,
      this.hp,
      this.type
    );
    this.healthbar.initiate();

    const sprite = createHTMLElement("img");
    sprite.src = this.sprite;
    sprite.style.transition = "all 0.5s ease";

    let children = [];

    if (this.type === "enemy") {
      children = [healthbarHolder, nameHolder, sprite];
    } else {
      children = [sprite, nameHolder, healthbarHolder];
    }

    appendChildrenToParent(children, holder);

    if (this.type === "enemy") {
      const enemyDiv = document.getElementsByClassName("enemyDiv")[0];
      enemyDiv.appendChild(holder);
    } else {
      const playerDiv = document.getElementsByClassName("playerDiv")[0];
      playerDiv.appendChild(holder);
    }
  }

  attack(enemy) {
    let damageMultiplier = Math.floor(Math.random() * 20);
    let damage = Math.round((this.dmg / enemy.def) * damageMultiplier);

    if (damage > 0) {
      this.attackAnimation(this.type);

      if (enemy.type === "enemy") {
        this.hitAnimation(enemy);
      }

      this.hitSound.play();
    } else {
      alert(`${this.name} Missed an Attack`);
    }

    enemy.hp -= damage;
    enemy.healthbar.update(damage);
  }

  attackAnimation(type) {
    const playerSprite = document.querySelector(`.${type}Div .player img`);

    playerSprite.style.transform =
      type === "player" ? "translateY(-180%)" : "translateY(180%)";
    setTimeout(() => {
      playerSprite.style.transform = "translateY(0)";
    }, 2000);
  }

  hitAnimation(target) {
    const targetSprite = document.querySelector("img");

    let animation = setInterval(flicker, 401);

    setTimeout(() => {
      clearInterval(animation);
    }, 1203);

    function flicker() {
      targetSprite.style.transition = "500ms ease";
      targetSprite.style.opacity = "0.3";
      setTimeout(() => {
        targetSprite.style.opacity = "1";
      }, 200);
    }
  }
}
