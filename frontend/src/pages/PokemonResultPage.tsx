import { useLocation, useNavigate } from "react-router-dom";
import PokemonCard from "../components/PokemonCard";
import type { AgentResponse } from "../services/agent";

export default function PokemonResultPage() {
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
            <p>Não foi possível carregar os dados do Pokémon.</p>
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

          <h1>{response.pokemon[0].name}</h1>

          <p>{response.answer}</p>
        </header>

        <div className="comparison-grid">
          {response.pokemon.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      </div>
    </main>
  );
}
