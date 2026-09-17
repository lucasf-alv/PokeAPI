export type PokemonStats = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

export type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: PokemonStats;
};

export type PokemonPage = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
};

const API_URL = "http://localhost:3000";

export async function getPokemonPage(
  limit = 20,
  offset = 0,
): Promise<PokemonPage> {
  const response = await fetch(
    `${API_URL}/pokemon?limit=${limit}&offset=${offset}`,
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar Pokémon.");
  }

  return response.json();
}
