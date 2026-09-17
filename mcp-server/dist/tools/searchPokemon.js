import { getPokemonList } from "../pokeapi.js";
export async function searchPokemon(query) {
    const data = await getPokemonList();
    const normalizedQuery = query.toLowerCase().trim();
    return data.results.filter((pokemon) => pokemon.name.includes(normalizedQuery));
}
