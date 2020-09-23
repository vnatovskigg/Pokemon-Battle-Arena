let allTwentyPokemons = [];

function fetchPokemon() {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=150")
    .then((response) => response.json())
    .then(function (allpokemon) {
      allpokemon.results.forEach(function (pokemon) {
        fetchPokemonData(pokemon);
      });
    });
}

function fetchPokemonData(pokemon) {
  const url = pokemon.url;
  const pokemonDiv = document.getElementById("pokemon");

  fetch(url)
    .then((response) => response.json())
    .then(function (pokeData) {
      allTwentyPokemons.push(pokeData);
      pokemonDiv.appendChild(appendPokemon(pokeData));
    });
}

function appendPokemon(data) {
  console.log(data);
  let { abilities, moves, name, sprites, stats } = data;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  const imgUrl = sprites.front_default;
  let ability = "";
  abilities.forEach((a) => {
    if (!a.is_hidden) {
      ability = a.ability.name.split("-").join(" ");
    }
  });
  moves = moves.splice(0, 4);

  let fighterDiv = createHTMLElement("div", "fighter");
  const img = createHTMLElement("img", null, null, [{ k: "src", v: imgUrl }]);
  fighterDiv.appendChild(img);

  const pokeName = createHTMLElement("span", "pokeName", name);
  fighterDiv.appendChild(pokeName);

  const abilitySpan = createHTMLElement("span", null, `Ability: ${ability}`);
  abilitySpan.style["text-transform"] = "capitalize";
  fighterDiv.appendChild(abilitySpan);

  const moveSpans = [];
  moves.forEach((move, i) => {
    const moveName = move.move.name.split("-").join(" ");
    move = createHTMLElement("span", null, `Move ${i + 1}: ${moveName}`);
    move.style["text-transform"] = "capitalize";
    moveSpans.push(move);
  });
  fighterDiv = appendChildrenToParent(moveSpans, fighterDiv);

  const statSpans = [];
  stats.forEach((stat) => {
    statSpans.push(
      createHTMLElement("span", null, `${stat.stat.name}: ${stat.base_stat}`)
    );
  });
  fighterDiv = appendChildrenToParent(statSpans, fighterDiv);

  fighterDiv.addEventListener("click", () => {
    drawArena(data);
  });

  return fighterDiv;
}

function createHTMLElement(tagName, className, textContent, attributes, event) {
  let element = document.createElement(tagName);
  if (className) {
    element.classList.add(className);
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  if (attributes) {
    attributes.forEach((a) => element.setAttribute(a.k, a.v));
  }

  if (event) {
    element.addEventListener(event.name, event.func);
  }

  return element;
}

function appendChildrenToParent(children, parent) {
  children.forEach((child) => parent.appendChild(child));

  return parent;
}

function drawArena(data) {
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

  let player1 = new Player(data, "player");
  player1.renderPlayer();

  const enemyIndex = Math.floor(Math.random() * 150);
  let player2 = new Player(allTwentyPokemons[enemyIndex], "enemy");
  player2.renderPlayer();

  const game = new Battle(player1, player2);
  game.startGame();
  // game.playRound();
  // game.playRound();
}

class Battle {
  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;
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
    let player2 = new Player(allTwentyPokemons[enemyIndex], "enemy");
    player2.renderPlayer();

    this.player.hp = this.player.maxHp;
    this.player.renderPlayer();

    const nextGame = new Battle(this.player, player2);
    nextGame.startGame();
  }
}

class Player {
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
    const bar = createHTMLElement("div", `health-bar`);
    healthbarHolder.appendChild(bar);
    this.healthbar = new Healthbar(
      healthbarHolder,
      this.hp,
      this.hp,
      this.type
    );

    const sprite = createHTMLElement("img");
    sprite.src = this.sprite;
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
    let damage = (this.dmg / enemy.def) * damageMultiplier;

    if (damage > 0) {
      this.attackAnimation();
      this.hitSound.volume = 1;
      this.hitSound.play();
    } else {
      alert("Attack Missed");
    }

    enemy.hp -= damage;
    enemy.healthbar.update(damage);
  }

  attackAnimation() {
    if (this.type === "player") {
      const playerSprite = document.querySelector(".playerDiv .player img");
      playerSprite.style.transition = "all 0.5s ease";
      playerSprite.style.transform = "translateY(-200%)";
      setTimeout(() => {
        playerSprite.style.transform = "translateY(0)";
      }, 2000);
    } else {
      const enemySprite = document.querySelector(".enemyDiv .player img");
      enemySprite.style.transition = "all 0.5s ease";
      enemySprite.style.transform = "translateY(200%)";
      setTimeout(() => {
        enemySprite.style.transform = "translateY(0)";
      }, 2000);
    }
  }
}

class Healthbar {
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

fetchPokemon();
