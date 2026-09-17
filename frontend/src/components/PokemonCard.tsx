import type { Pokemon } from "../services/pokemon";

type PokemonCardProps = {
  pokemon: Pokemon;
};

export default function PokemonCard({
  pokemon,
}: PokemonCardProps) {
  return (
    <article className="pokemon-card">
      <span className="pokemon-id">
        #{String(pokemon.id).padStart(3, "0")}
      </span>

      <img
        src={pokemon.image}
        alt={pokemon.name}
        className="pokemon-image"
      />

      <h2>{pokemon.name}</h2>

      <div className="types">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className={`type type-${type}`}
          >
            {type}
          </span>
        ))}
      </div>

      <div className="stats">
        <div>
          <span>HP</span>
          <strong>{pokemon.stats.hp}</strong>
        </div>

        <div>
          <span>Attack</span>
          <strong>{pokemon.stats.attack}</strong>
        </div>

        <div>
          <span>Defense</span>
          <strong>{pokemon.stats.defense}</strong>
        </div>

        <div>
          <span>Sp. Attack</span>
          <strong>{pokemon.stats.specialAttack}</strong>
        </div>

        <div>
          <span>Sp. Defense</span>
          <strong>{pokemon.stats.specialDefense}</strong>
        </div>

        <div>
          <span>Speed</span>
          <strong>{pokemon.stats.speed}</strong>
        </div>
      </div>
    </article>
  );
}
