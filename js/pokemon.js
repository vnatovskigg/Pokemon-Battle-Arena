import Arena from "./arena.js";
import { createHTMLElement, appendChildrenToParent } from "./utils.js";

export default class Pokemon {
  constructor() {
    this.allTwentyPokemons = [];
  }

  fetchPokemon() {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=150")
      .then((res) => res.json())
      .then((allpokemons) => {
        allpokemons.results.forEach((pokemon) => {
          this.fetchPokemonData(pokemon);
        });
      });
  }

  fetchPokemonData(pokemon) {
    const url = pokemon.url;
    const pokemonDiv = document.getElementById("pokemon");

    fetch(url)
      .then((res) => res.json())
      .then((pokeData) => {
        this.allTwentyPokemons.push(pokeData);

        const pokemonCard = this.appendPokemon(pokeData);
        pokemonDiv.appendChild(pokemonCard);
      });
  }

  appendPokemon(data) {
    let { abilities, moves, name, sprites, stats } = data;
    const moveSpans = [];

    // Format Data for Appending to DOM
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
    const pokeName = createHTMLElement("span", "pokeName", name);
    const abilitySpan = createHTMLElement("span", null, `Ability: ${ability}`);
    abilitySpan.style["text-transform"] = "capitalize";

    // Append Moves
    moves.forEach((move, i) => {
      const moveName = move.move.name.split("-").join(" ");
      move = createHTMLElement("span", null, `Move ${i + 1}: ${moveName}`);
      move.style["text-transform"] = "capitalize";
      moveSpans.push(move);
    });

    // Append Stats
    const statSpans = [];
    stats.forEach((stat) => {
      statSpans.push(
        createHTMLElement("span", null, `${stat.stat.name}: ${stat.base_stat}`)
      );
    });

    fighterDiv.addEventListener("click", () => {
      const arena = new Arena(data, this.allTwentyPokemons).drawArena(); //TODO
    });

    // Append all data to the pokemon card
    fighterDiv.appendChild(img);
    fighterDiv.appendChild(pokeName);
    fighterDiv.appendChild(abilitySpan);
    fighterDiv = appendChildrenToParent(moveSpans, fighterDiv);
    fighterDiv = appendChildrenToParent(statSpans, fighterDiv);

    return fighterDiv;
  }
}
