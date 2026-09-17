import { getPokemonList } from "../pokeapi.js";

export async function getPokemonListTool(limit: number, offset: number) {
  const data = await getPokemonList(limit, offset);

  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: data.results,
  };
}
