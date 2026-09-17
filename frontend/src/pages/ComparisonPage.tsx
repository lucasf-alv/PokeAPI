import { useLocation, useNavigate } from "react-router-dom";

import PokemonCard from "../components/PokemonCard";
import type { AgentResponse } from "../services/agent";

export default function ComparisonPage() {
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
          <span className="eyebrow">COMPARAÇÃO</span>

          <h1>Comparação Pokémon</h1>

          <p>{response.answer}</p>
        </header>

        <section className="comparison-grid">
          {response.pokemon.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
