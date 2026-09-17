import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { askAgent } from "../services/agent";

export default function ChatPage() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (!message.trim() || loading) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await askAgent(message);

      if (response.view === "comparison") {
        navigate("/comparison", {
          state: response,
        });

        return;
      }

      if (response.view === "evolution") {
        navigate("/evolution", {
          state: response,
        });

        return;
      }

      if (response.view === "pokemon") {
        navigate("/pokemon-result", {
          state: response,
        });

        return;
      }

      if (response.view === "type") {
        navigate("/type-result", {
          state: response,
        });

        return;
      }

      navigate("/ai-result", {
        state: response,
      });
    } catch (error) {
      console.error(error);
      setError(
        "Não foi possível conversar com o agente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="ai-page">
      <div className="ai-container">
        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Voltar para a Pokédex
        </button>

        <div className="ai-header">
          <span className="eyebrow">POKÉDEX AI</span>

          <h1>Converse com seu assistente</h1>

          <p>
            Pergunte sobre Pokémon, comparações, tipos,
            evoluções e estatísticas.
          </p>
        </div>

        <form
          className="chat-form"
          onSubmit={handleSubmit}
        >
          <textarea
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder="Ex: Quem é mais forte, Blastoise ou Charizard?"
            rows={5}
          />

          <button
            type="submit"
            className="chat-submit"
            disabled={loading || !message.trim()}
          >
            {loading
              ? "Analisando..."
              : "Perguntar à IA"}
          </button>
        </form>

        {error && (
          <p className="status error">{error}</p>
        )}
      </div>
    </main>
  );
}
