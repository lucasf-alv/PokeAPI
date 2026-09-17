import { getPokemonList } from "../pokeapi.js";

export async function searchPokemon(query: string) {
  const data = await getPokemonList();

  const normalizedQuery = query.toLowerCase().trim();

  return data.results.filter((pokemon: { name: string }) =>
    pokemon.name.includes(normalizedQuery),
  );
}
