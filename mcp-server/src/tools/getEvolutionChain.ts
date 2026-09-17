import {
  getPokemon,
  getPokemonSpecies,
  getEvolutionChain as getEvolutionChainApi,
} from "../pokeapi.js";

interface EvolutionNode {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionNode[];
}

export async function getEvolutionChain(name: string) {
  const pokemon = await getPokemon(name);

  const species = await getPokemonSpecies(pokemon.species.url);

  const evolutionData = await getEvolutionChainApi(species.evolution_chain.url);

  const evolutionChain: string[] = [];

  function extractEvolution(node: EvolutionNode) {
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
