import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PokemonCard from "../components/PokemonCard";

import {
  getPokemonPage,
  type Pokemon,
} from "../services/pokemon";

const LIMIT = 20;

export default function HomePage() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPokemon() {
      try {
        setLoading(true);
        setError("");

        const data = await getPokemonPage(
          LIMIT,
          offset,
        );

        setPokemons(data.results);
        setTotal(data.count);
      } catch (error) {
        console.error(error);

        setError(
          "Não foi possível carregar os Pokémon.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPokemon();
  }, [offset]);

  const currentPage =
    Math.floor(offset / LIMIT) + 1;

  const totalPages = Math.ceil(total / LIMIT);

  function nextPage() {
    if (offset + LIMIT < total) {
      setOffset(offset + LIMIT);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function previousPage() {
    if (offset > 0) {
      setOffset(offset - LIMIT);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  return (
    <main className="app">
      <header className="header">
        <div className="title-section">
          <span className="eyebrow">
            POKÉDEX
          </span>

          <h1>
            Explore o mundo Pokémon
          </h1>

          <p className="description">
            Descubra Pokémon, tipos e estatísticas
            através da PokéAPI.
          </p>

          <Link
            to="/ai"
            className="ai-button"
          >
            🤖 Pergunte à IA
          </Link>
        </div>
      </header>

      {loading && (
        <div className="status">
          Carregando Pokémon...
        </div>
      )}

      {error && (
        <div className="status error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="pokemon-grid">
            {pokemons.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
              />
            ))}
          </section>

          <nav className="pagination">
            <button
              className="pagination-button"
              onClick={previousPage}
              disabled={offset === 0}
            >
              <span>←</span>
              Anterior
            </button>

            <div className="page-indicator">
              <span>Página</span>
              <strong>{currentPage}</strong>
              <span>de {totalPages}</span>
            </div>

            <button
              className="pagination-button"
              onClick={nextPage}
              disabled={offset + LIMIT >= total}
            >
              Próxima
              <span>→</span>
            </button>
          </nav>
        </>
      )}
    </main>
  );
}
