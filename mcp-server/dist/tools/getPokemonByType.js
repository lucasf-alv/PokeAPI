import { getPokemonType } from "../pokeapi.js";
export async function getPokemonByType(type) {
    const data = await getPokemonType(type);
    return {
        type: data.name,
        pokemon: data.pokemon.map((item) => ({
            name: item.pokemon.name,
            url: item.pokemon.url,
        })),
    };
}
