import { getPokemon, getPokemonList } from "../pokeapi.js";

export async function getPokemonPage(
  limit: number,
  offset: number,
) {
  const list = await getPokemonList(limit, offset);

  const pokemon = await Promise.all(
    list.results.map(async (item: { name: string }) => {
      const data = await getPokemon(item.name);

      return {
        id: data.id,
        name: data.name,
        image:
          data.sprites.other["official-artwork"].front_default,
        types: data.types.map(
          (type: { type: { name: string } }) =>
            type.type.name,
        ),
        stats: {
          hp: data.stats.find(
            (stat: { stat: { name: string } }) =>
              stat.stat.name === "hp",
          )?.base_stat,

          attack: data.stats.find(
            (stat: { stat: { name: string } }) =>
              stat.stat.name === "attack",
          )?.base_stat,

          defense: data.stats.find(
            (stat: { stat: { name: string } }) =>
              stat.stat.name === "defense",
          )?.base_stat,

          specialAttack: data.stats.find(
            (stat: { stat: { name: string } }) =>
              stat.stat.name === "special-attack",
          )?.base_stat,

          specialDefense: data.stats.find(
            (stat: { stat: { name: string } }) =>
              stat.stat.name === "special-defense",
          )?.base_stat,

          speed: data.stats.find(
            (stat: { stat: { name: string } }) =>
              stat.stat.name === "speed",
          )?.base_stat,
        },
      };
    }),
  );

  return {
    count: list.count,
    next: list.next,
    previous: list.previous,
    results: pokemon,
  };
}
