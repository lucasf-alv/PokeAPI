import { getPokemon } from "../pokeapi.js";
export async function getPokemonTool(name) {
    const data = await getPokemon(name);
    return {
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        types: data.types.map((type) => type.type.name),
        abilities: data.abilities.map((ability) => ability.ability.name),
        image: data.sprites.other["official-artwork"].front_default,
        stats: {
            hp: data.stats.find((stat) => stat.stat.name === "hp")?.base_stat,
            attack: data.stats.find((stat) => stat.stat.name === "attack")?.base_stat,
            defense: data.stats.find((stat) => stat.stat.name === "defense")?.base_stat,
            specialAttack: data.stats.find((stat) => stat.stat.name === "special-attack")?.base_stat,
            specialDefense: data.stats.find((stat) => stat.stat.name === "special-defense")?.base_stat,
            speed: data.stats.find((stat) => stat.stat.name === "speed")?.base_stat,
        },
    };
}
