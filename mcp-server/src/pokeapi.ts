const POKE_API_URL = "https://pokeapi.co/api/v2";

export async function getPokemon(name: string) {
  const response = await fetch(
    `${POKE_API_URL}/pokemon/${name.toLowerCase().trim()}`,
  );

  if (!response.ok) {
    throw new Error(`Pokémon não encontrado: ${name}`);
  }

  return response.json();
}

export async function getPokemonList(limit = 20, offset = 0) {
  const response = await fetch(
    `${POKE_API_URL}/pokemon?limit=${limit}&offset=${offset}`,
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar a lista de Pokémon.");
  }

  return response.json();
}

export async function getPokemonType(type: string) {
  const response = await fetch(
    `${POKE_API_URL}/type/${type.toLowerCase().trim()}`,
  );

  if (!response.ok) {
    throw new Error(`Tipo de Pokémon não encontrado: ${type}`);
  }

  return response.json();
}

export async function getPokemonSpecies(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao buscar espécie do Pokémon.");
  }

  return response.json();
}

export async function getEvolutionChain(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao buscar cadeia evolutiva.");
  }

  return response.json();
}
