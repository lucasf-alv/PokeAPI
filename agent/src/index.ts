import "dotenv/config";

import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { z } from "zod";

import {
  Agent,
  MCPServerStdio,
  OpenAIChatCompletionsModel,
  run,
  setTracingDisabled,
} from "@openai/agents";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

setTracingDisabled(true);

const openai = new OpenAI({
  baseURL: process.env.OLLAMA_BASE_URL,
  apiKey: process.env.OLLAMA_API_KEY,
});

const mcpServer = new MCPServerStdio({
  name: "Pokemon MCP Server",
  fullCommand: "npx tsx ../mcp-server/src/index.ts",
  cwd: process.cwd(),
});

const AgentResponse = z.object({
  view: z.enum([
    "pokemon",
    "comparison",
    "evolution",
    "type",
    "other",
  ]),

  answer: z.string(),

  pokemonNames: z.array(z.string()),
});

const agent = new Agent({
  name: "Pokemon Assistant",

  instructions: `
Você é um assistente especializado EXCLUSIVAMENTE em Pokémon.

Você possui ferramentas MCP conectadas à PokéAPI.

Seu trabalho é entender a intenção do usuário, usar as ferramentas
MCP necessárias e retornar uma resposta estruturada para uma
interface web.

REGRAS:

1. Perguntas sobre um Pokémon específico:
   - Use get_pokemon.
   - view deve ser "pokemon".
   - pokemonNames deve conter o Pokémon.

2. Comparações entre Pokémon:
   - Use get_pokemon para buscar TODOS os Pokémon envolvidos.
   - view deve ser "comparison".
   - pokemonNames deve conter todos os Pokémon envolvidos.
   - Baseie sua resposta somente nos dados retornados pelas tools.
   - Não invente estatísticas.
   - Não altere valores retornados pela PokéAPI.

3. Perguntas sobre evolução:
   - Use get_evolution_chain.
   - view deve ser "evolution".
   - pokemonNames deve conter TODOS os Pokémon da cadeia evolutiva.

4. Perguntas sobre tipos:
   - Use get_pokemon_by_type.
   - view deve ser "type".
   - pokemonNames deve conter os Pokémon encontrados.

5. Perguntas fora do universo Pokémon:
   - Não use ferramentas Pokémon.
   - view deve ser "other".
   - pokemonNames deve ser [].
   - Explique que você responde apenas perguntas relacionadas a Pokémon.

6. Nunca invente informações que podem ser obtidas através das
   ferramentas MCP.

7. Responda sempre em português.

Exemplos:

Pergunta:
"Quem é mais forte, Blastoise ou Charizard?"

view:
"comparison"

pokemonNames:
["blastoise", "charizard"]

Pergunta:
"Quero a escala evolutiva do Bulbasaur."

view:
"evolution"

pokemonNames:
["bulbasaur", "ivysaur", "venusaur"]

Pergunta:
"Me fale sobre Pikachu."

view:
"pokemon"

pokemonNames:
["pikachu"]

Pergunta:
"Qual é a capital da França?"

view:
"other"

pokemonNames:
[]

answer:
"Posso responder apenas perguntas relacionadas a Pokémon."
`,

  model: new OpenAIChatCompletionsModel(
    openai,
    process.env.OLLAMA_MODEL!,
  ),

  mcpServers: [mcpServer],

  outputType: AgentResponse,
});

async function getPokemonFromMcp(name: string) {
  const result = await mcpServer.callTool(
    "get_pokemon",
    {
      name,
    },
  );

  const textContent = result.find(
    (content) => content.type === "text",
  );

  if (!textContent || textContent.type !== "text") {
    throw new Error("Resposta inválida do MCP Server.");
  }

  return JSON.parse(String(textContent.text));
}

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "pokemon-agent",
  });
});

app.get("/pokemon", async (req, res) => {
  try {
    const limit = Math.min(
      Number(req.query.limit) || 20,
      20,
    );

    const offset = Math.max(
      Number(req.query.offset) || 0,
      0,
    );

    const result = await mcpServer.callTool(
      "get_pokemon_page",
      {
        limit,
        offset,
      },
    );

    const textContent = result.find(
      (content) => content.type === "text",
    );

    if (!textContent || textContent.type !== "text") {
      throw new Error("Resposta inválida do MCP Server.");
    }

    return res.json(
      JSON.parse(String(textContent.text)),
    );
  } catch (error) {
    console.error("Erro em GET /pokemon:", error);

    return res.status(500).json({
      error: "Erro ao buscar Pokémon.",
    });
  }
});

app.get("/pokemon/:name", async (req, res) => {
  try {
    const pokemon = await getPokemonFromMcp(
      req.params.name,
    );

    return res.json({
      pokemon,
    });
  } catch (error) {
    console.error(
      `Erro em GET /pokemon/${req.params.name}:`,
      error,
    );

    return res.status(500).json({
      error: "Erro ao buscar Pokémon.",
    });
  }
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "A mensagem é obrigatória.",
      });
    }

    const result = await run(agent, message);

    const output = result.finalOutput;

    if (!output) {
      throw new Error(
        "O agente não retornou uma resposta.",
      );
    }

    if (output.view === "other") {
      return res.json({
        view: "other",
        answer: output.answer,
        pokemon: [],
      });
    }

    const pokemon = await Promise.all(
      output.pokemonNames.map((name) =>
        getPokemonFromMcp(name),
      ),
    );

    return res.json({
      view: output.view,
      answer: output.answer,
      pokemon,
    });
  } catch (error) {
    console.error("Erro em POST /chat:", error);

    return res.status(500).json({
      error: "Erro ao processar a mensagem.",
    });
  }
});

async function start() {
  await mcpServer.connect();

  app.listen(PORT, () => {
    console.log(
      `Agent API rodando em http://localhost:${PORT}`,
    );
  });
}

async function shutdown() {
  console.log("\nEncerrando Agent...");

  await mcpServer.close();

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start().catch((error) => {
  console.error(
    "Erro ao iniciar o Agent:",
    error,
  );

  process.exit(1);
});
