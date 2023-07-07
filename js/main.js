let url = "https://pokeapi.co/api/v2/pokemon/";
const pokemonList = document.querySelector("#pokemonList");
const headerButtons = document.querySelectorAll(".btn-header");

document.addEventListener('DOMContentLoaded', () => {
  getPokemonData();
});

async function getPokemonData() {

  for (let i = 1; i <= 151; i++) {

    try {
        const response = await fetch(url + i);
        const pokemonData = await response.json();

        const pokemon = {
          id: pokemonData.id,
          img: pokemonData.sprites.other["official-artwork"].front_default,
          name: pokemonData.name,
          height: pokemonData.height,
          weight: pokemonData.weight,
          types: pokemonData.types.map((type) => type.type.name)
        };

        showPokemon(pokemon);
    } catch (error) {
    console.log("Error fetching Pokémon data:", error);
  }
  }
}

function showPokemon(pokemon) {

  let pokeId = pokemonId(pokemon);
  let pokeType = pokemonTypes(pokemon);

  let div = document.createElement("div");
  div.classList.add("pokemon");
  div.innerHTML = `
    <p class="pokemon-id-back">#${pokeId}</p>
    <div class="pokemon-image">
      <img
        src="${pokemon.img}"
        alt="${pokemon.name}"
      />
    </div>
    <div class="pokemon-info">
      <div class="container-name">
        <p class="pokemon-id">#${pokeId}</p>
        <h2 class="pokemon-name">${pokemon.name}</h2>
      </div>
      <div class="pokemon-types">
        ${pokeType}
      </div>
      <div class="pokemon-stats">
        <p class="stat">${pokemon.height}m</p>
        <p class="stat">${pokemon.weight}kg</p>
      </div>
    </div>
  `;

  pokemonList.append(div);
}

function pokemonId(pokemon) {

  let pokeId = pokemon.id.toString();

  if (pokeId.length === 1) {
    return pokeId = "00" + pokeId;
  } 
  else if (pokeId.length === 2) {
    return pokeId = "0" + pokeId;
  } 
  else {
    return pokeId;
  }
}

function pokemonTypes(pokemon) {
  let tipos = pokemon.types.map((type) => `<p class="${type} type">${type}</p>`);
  return tipos.join('');
}

headerButtons.forEach(btn => btn.addEventListener("click", async (event) => {
  const botonId = event.currentTarget.id;

  pokemonList.innerHTML = "";

  for (let i = 1; i <= 151; i++) {
    try {
      const response = await fetch(url + i);
      const data = await response.json();

      const pokemon = {
        id: data.id,
        img: data.sprites.other["official-artwork"].front_default,
        name: data.name,
        height: data.height,
        weight: data.weight,
        types: data.types.map((type) => type.type.name)
      };

      if (botonId === "see-all") {
        showPokemon(pokemon);
      } else {
        const tipos = data.types.map((type) => type.type.name);
        if (tipos.includes(botonId)) {
          showPokemon(pokemon);
        }
      }
    } catch (error) {
      console.log("Error fetching Pokémon data:", error);
    }
  }
}));