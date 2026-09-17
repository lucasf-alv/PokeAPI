import { useLocation, useNavigate } from "react-router-dom";

import PokemonCard from "../components/PokemonCard";
import type { AgentResponse } from "../services/agent";

export default function EvolutionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const response = location.state as AgentResponse | undefined;

  if (!response) {
    navigate("/");

    return null;
  }

  return (
    <main className="result-page">
      <div className="result-container">
        <button
          className="back-button"
          onClick={() => navigate("/ai")}
        >
          ← Nova pergunta
        </button>

        <header className="result-header">
          <span className="eyebrow">EVOLUÇÃO</span>

          <h1>Escala evolutiva</h1>

          <p>{response.answer}</p>
        </header>

        <section className="evolution-grid">
          {response.pokemon.map((pokemon, index) => (
            <div
              className="evolution-item"
              key={pokemon.id}
            >
              <PokemonCard pokemon={pokemon} />

              {index < response.pokemon.length - 1 && (
                <span className="evolution-arrow">
                  →
                </span>
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
