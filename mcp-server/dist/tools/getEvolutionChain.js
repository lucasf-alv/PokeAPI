import { getPokemon, getPokemonSpecies, getEvolutionChain as getEvolutionChainApi, } from "../pokeapi.js";
export async function getEvolutionChain(name) {
    const pokemon = await getPokemon(name);
    const species = await getPokemonSpecies(pokemon.species.url);
    const evolutionData = await getEvolutionChainApi(species.evolution_chain.url);
    const evolutionChain = [];
    function extractEvolution(node) {
        evolutionChain.push(node.species.name);
        for (const evolution of node.evolves_to) {
            extractEvolution(evolution);
        }
    }
    extractEvolution(evolutionData.chain);
    return {
        pokemon: pokemon.name,
        evolutionChain,
    };
}
