import { useLocation, useNavigate } from "react-router-dom";

import type { AgentResponse } from "../services/agent";

export default function AIResultPage() {
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

        <div className="ai-result">
          <span className="eyebrow">POKÉDEX AI</span>

          <h1>Resposta</h1>

          <p>{response.answer}</p>
        </div>
      </div>
    </main>
  );
}
