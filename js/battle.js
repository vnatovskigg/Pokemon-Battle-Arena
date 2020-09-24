import Player from "./player.js";
import { createHTMLElement, appendChildrenToParent } from "./utils.js";

export default class Battle {
  constructor(player, enemy, pokemonList) {
    this.player = player;
    this.enemy = enemy;
    this.pokemonList = pokemonList;
    this.song = new Audio("../assets/battle.mp3");
  }

  startGame() {
    this.song.volume = 0.4;
    this.song.play();
    this.song.addEventListener(
      "ended",
      function () {
        this.currentTime = 0;
        this.play();
      },
      false
    );

    const playerDiv = document.querySelector(".playerDiv .player");
    this.fightBtn = createHTMLElement("button", "fight-btn", "Attack");
    this.fightBtn.addEventListener("click", () =>
      this.playRound(this.player, this.enemy)
    );

    playerDiv.appendChild(this.fightBtn);

    console.log("Initial player hp:  ", this.player.hp);
    console.log("Initial enemy hp:  ", this.enemy.hp);
  }

  playRound(player, enemy) {
    this.fightBtn.disabled = true;
    if (player.speed > enemy.speed) {
      player.attack(enemy);

      if (enemy.hp > 0) {
        setTimeout(() => {
          enemy.attack(player);
        }, 3000);
      }
    } else {
      enemy.attack(player);

      if (player.hp > 0) {
        setTimeout(() => {
          player.attack(enemy);
        }, 3000);
      }
    }

    setTimeout(() => {
      this.fightBtn.disabled = false;
      this.checkWin();
    }, 6000);
  }

  checkWin() {
    if (this.player.hp <= 0 || this.enemy.hp <= 0) {
      if (this.player.hp <= 0) {
        alert("You Lose");
      }

      if (this.enemy.hp <= 0) {
        alert("You Win");
      }

      this.fightBtn.remove();

      const playerDiv = document.querySelector(".playerDiv .player");

      this.rematchBtn = createHTMLElement("button", "rematchBtn", "Play Again");
      this.rematchBtn.addEventListener("click", () => this.rematch());
      playerDiv.appendChild(this.rematchBtn);

      this.switchOpponent = createHTMLElement(
        "button",
        null,
        "Change Opponent"
      );
      this.switchOpponent.addEventListener("click", () => this.nextOpponent());
      playerDiv.appendChild(this.switchOpponent);
    }
  }

  rematch() {
    this.song.pause();
    this.song.currentTime = 0;

    document.querySelectorAll(".player").forEach((div) => div.remove());
    this.player.hp = this.player.maxHp;
    this.player.renderPlayer();

    this.enemy.hp = this.enemy.maxHp;
    this.enemy.renderPlayer();

    const rematchGame = new Battle(this.player, this.enemy);
    rematchGame.startGame();
  }

  nextOpponent() {
    this.song.pause();
    this.song.currentTime = 0;

    document.querySelectorAll(".player").forEach((div) => div.remove());

    const enemyIndex = Math.floor(Math.random() * 150);
    let player2 = new Player(this.pokemonList[enemyIndex], "enemy");
    player2.renderPlayer();

    this.player.hp = this.player.maxHp;
    this.player.renderPlayer();

    const nextGame = new Battle(this.player, player2, this.pokemonList);
    nextGame.startGame();
  }
}
