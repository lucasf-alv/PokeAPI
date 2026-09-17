import type { Pokemon } from "./pokemon";

export type AgentResponse = {
  view: "pokemon" | "comparison" | "evolution" | "type" | "other";
  answer: string;
  pokemon: Pokemon[];
};

export async function askAgent(
  message: string,
): Promise<AgentResponse> {
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao conversar com o agente.");
  }

  return response.json();
}
