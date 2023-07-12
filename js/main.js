let url = "https://pokeapi.co/api/v2/pokemon";
const pokemonList = document.querySelector("#pokemonList");
const headerButtons = document.querySelectorAll(".btn-header");
let limit = 30;
let offset = 0;
let allPokemon = [];
let botonId="null";
document.addEventListener('DOMContentLoaded', () => {
  getPokemonData();
  navButtons();
});

const pageNumbersContainer = document.querySelector("#pageNumbers");
let currentPage = 1;

function renderPageNumbers(totalPages) {
  pageNumbersContainer.innerHTML = "";

  const maxPageNumbers = Math.min(totalPages, 9); 

  const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  for (let i = startPage; i <= endPage; i++) {
    const pageNumber = document.createElement("button");
    pageNumber.classList.add("page-number");
    pageNumber.textContent = i;

    if (i === currentPage) {
      pageNumber.classList.add("active");
    }

    
    pageNumber.addEventListener("click", () => {
      currentPage = i;
      offset = (currentPage - 1) * limit; 
      pokemonList.innerHTML = "";
      getPokemonData();
      updateActivePageNumber();
    });
    
    pageNumbersContainer.appendChild(pageNumber);
  }
}

function updateActivePageNumber() {
  const pageNumbers = pageNumbersContainer.querySelectorAll(".page-number");

  pageNumbers.forEach((pageNumber) => {
    const pageNumberValue = parseInt(pageNumber.textContent);

    if (pageNumberValue === currentPage) {
      pageNumber.classList.add("active");
    } else {
      pageNumber.classList.remove("active");
    }
  });
}

async function getPokemonData() {
  try {
    const response = await fetch(`${url}?limit=${limit}&offset=${offset}`);
    const data = await response.json();

    const pokemonPromises = data.results.map(async (data) => {
      const pokemonResponse = await fetch(data.url);
      const pokemonData = await pokemonResponse.json();
      const pokemon = {
        id: pokemonData.id,
        img: pokemonData.sprites.other["official-artwork"].front_default,
        name: pokemonData.name,
        height: pokemonData.height,
        weight: pokemonData.weight,
        types: pokemonData.types.map((type) => type.type.name),
      };

      return pokemon;
    });
    
    
    
    allPokemon = [];

    if(botonId!=="null"){
      const pokemons = await Promise.all(pokemonPromises);
      const filteredPokemons = pokemons.filter((pokemon) => pokemon.types.includes(botonId));

      allPokemon = [...allPokemon, ...filteredPokemons];
      
      allPokemon.forEach((pokemon) => {
        showPokemon(pokemon);
      });

    }else{
      allPokemon = [];
      allPokemon = await Promise.all(pokemonPromises);
      allPokemon.forEach((pokemon) => {
        showPokemon(pokemon);
      });
    }

    const totalPages = Math.ceil(data.count / limit);
    renderPageNumbers(totalPages);
    updateActivePageNumber();
  } catch (error) {
    console.log("Error fetching Pokémon data:", error);
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
    return pokeId = "000" + pokeId;
  } 
  else if (pokeId.length === 2) {
    return pokeId = "00" + pokeId;
  }
  else if (pokeId.length === 3) {
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

const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    offset = (currentPage - 1) * limit;
    pokemonList.innerHTML = "";
    updateActivePageNumber();
    getPokemonData();
  }
});

nextButton.addEventListener("click", () => {
  currentPage++;
  offset = (currentPage - 1) * limit;
  pokemonList.innerHTML = "";
  updateActivePageNumber();
  console.log(botonId);
  getPokemonData();
});

function navButtons(){
  headerButtons.forEach((btn) =>
    btn.addEventListener("click", async () => {
      botonId = btn.id;
      pokemonList.innerHTML = "";
      offset = 0; 
      currentPage = 1; 
      try {
        let allPokemons = []; 


        const getAllPokemonsByType = async (offset) => {
          const response = await fetch(`${url}?limit=${limit}&offset=${offset}`);
          const data = await response.json();

          const pokemonPromises = data.results.map(async (data) => {
            const pokemonResponse = await fetch(data.url);
            const pokemonData = await pokemonResponse.json();
            const pokemon = {
              id: pokemonData.id,
              img: pokemonData.sprites.other["official-artwork"].front_default,
              name: pokemonData.name,
              height: pokemonData.height,
              weight: pokemonData.weight,
              types: pokemonData.types.map((type) => type.type.name),
            };

            return pokemon;
          });

          const pokemons = await Promise.all(pokemonPromises);
          
          const filteredPokemons = pokemons.filter((pokemon) => pokemon.types.includes(botonId));
          
          allPokemons = [...allPokemons, ...filteredPokemons]; 

          const nextPageOffset = offset + limit;
          if (nextPageOffset < data.count) {
            await getAllPokemonsByType(nextPageOffset);
          }
        };

        await getAllPokemonsByType(offset);
        const totalPages = Math.ceil(allPokemons.length / limit);
        renderPageNumbers(totalPages);
        updateActivePageNumber();

        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        const pokemonsToDisplay = allPokemons.slice(startIndex, endIndex);
        allPokemon = [];
        allPokemon = pokemonsToDisplay;
        allPokemon.forEach((pokemon) => {
          showPokemon(pokemon);
        });
      } catch (error) {
        console.log("Error fetching Pokémon data:", error);
      }
    })
  );
}