import Player from "./player.js";
import Battle from "./battle.js";
import { createHTMLElement, appendChildrenToParent } from "./utils.js";

export default class Arena {
  constructor(player, pokemonList) {
    this.player = player;
    this.pokemonList = pokemonList;
  }

  drawArena() {
    const pokemonContaier = document.getElementsByClassName(
      "pokemon-container"
    )[0];
    pokemonContaier.innerHTML = `<div class="header"><h1>Let's Battle!</h1></div>`;

    const arena = createHTMLElement("div", "arena");
    const playerDiv = createHTMLElement("div", "playerDiv");
    const enemyDiv = createHTMLElement("div", "enemyDiv");

    arena.appendChild(enemyDiv);
    arena.appendChild(playerDiv);
    pokemonContaier.appendChild(arena);

    let player1 = new Player(this.player, "player");
    player1.renderPlayer();

    const enemyIndex = Math.floor(Math.random() * 150);
    let player2 = new Player(this.pokemonList[enemyIndex], "enemy");
    player2.renderPlayer();

    const game = new Battle(player1, player2, this.pokemonList);
    game.startGame();
    // game.playRound();
    // game.playRound();
  }
}
