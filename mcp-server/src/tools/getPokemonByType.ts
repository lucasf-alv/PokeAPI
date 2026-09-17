import { getPokemonType } from "../pokeapi.js";

export async function getPokemonByType(type: string) {
  const data = await getPokemonType(type);

  return {
    type: data.name,
    pokemon: data.pokemon.map(
      (item: {
        pokemon: {
          name: string;
          url: string;
        };
      }) => ({
        name: item.pokemon.name,
        url: item.pokemon.url,
      }),
    ),
  };
}
