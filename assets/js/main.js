const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const trigger = document.getElementById("trigger");
const maxRecords = 151;
const limit = 10;
let offset = 0;

document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("playBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const stopBtn = document.getElementById("stopBtn");

  playBtn.addEventListener("click", function () {
    audio.play();
  });

  pauseBtn.addEventListener("click", function () {
    audio.pause();
  });

  stopBtn.addEventListener("click", function () {
    audio.pause();
    audio.currentTime = 0;
  });
});

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" id = ${pokemon.name}>
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;

    setTimeout(() => {
    trigger.style.display = 'block'
      
    }, 200);

    // Recupere os pokemons existentes no localStorage
    let existingPokemons = JSON.parse(localStorage.getItem("pokemons")) || [];

    // Adicione os novos pokemons à lista existente
    existingPokemons = existingPokemons.concat(pokemons);

    // Remova duplicatas
    existingPokemons = existingPokemons.filter(
      (pokemon, index, self) =>
        index === self.findIndex((t) => t.number === pokemon.number)
    );

    // Ordene os pokemons em ordem crescente pelo número
    existingPokemons.sort((a, b) => a.number - b.number);

    // Armazene os pokemons atualizados no localStorage
    localStorage.setItem("pokemons", JSON.stringify(existingPokemons));
  });
}

loadPokemonItens(offset, limit);

pokemonList.addEventListener("click", () => {
  const element = event.target.closest(".pokemon");
  if (element) {
    event.preventDefault();
    const selectedPokemon = Pokemons[element.id];
    localStorage.setItem("selectedPokemon", JSON.stringify(selectedPokemon));
    window.location.href = "/pokemon-details.html";
  }
});

// observer
let options = {
  root: null,
  rootMargin: "0px",
  threshold: 1.0,
};

// IntersectionObserver detecta quando um elemento na página entra na área 
// visível do usuário, conhecida como "viewport".
let observer = new IntersectionObserver((entries, observer) => {
  if (entries[0].isIntersecting) {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;
    if (qtdRecordsWithNextPage >= maxRecords) {
      const newLimit = maxRecords - offset;
      loadPokemonItens(offset, newLimit);

      // Desconecta o IntersectionObserver quando atinge maxRecords
      observer.disconnect();
    } else {
      loadPokemonItens(offset, limit);
    }
  }
}, options);

observer.observe(document.querySelector("#trigger"));