import { useLocation, useNavigate } from "react-router-dom";
import PokemonCard from "../components/PokemonCard";
import type { AgentResponse } from "../services/agent";

export default function TypeResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const response = location.state as AgentResponse | undefined;

  if (!response || response.pokemon.length === 0) {
    return (
      <main className="result-page">
        <div className="result-container">
          <button className="back-button" onClick={() => navigate("/ai")}>
            ← Voltar para a IA
          </button>

          <div className="ai-result">
            <h1>Nenhum Pokémon encontrado</h1>
            <p>Não foi possível encontrar Pokémon para esse tipo.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="result-page">
      <div className="result-container">
        <button className="back-button" onClick={() => navigate("/ai")}>
          ← Voltar para a IA
        </button>

        <header className="result-header">
          <span className="eyebrow">POKÉDEX AI</span>

          <h1>Pokémon por tipo</h1>

          <p>{response.answer}</p>
        </header>

        <div className="pokemon-grid">
          {response.pokemon.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      </div>
    </main>
  );
}
