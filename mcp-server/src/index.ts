import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

import { getPokemonTool } from "./tools/getPokemon.js";
import { searchPokemon } from "./tools/searchPokemon.js";
import { getPokemonByType } from "./tools/getPokemonByType.js";
import { getEvolutionChain } from "./tools/getEvolutionChain.js";
import { getPokemonListTool } from "./tools/getPokemonList.js";
import { getPokemonPage } from "./tools/getPokemonPage.js";

const server = new McpServer({
  name: "pokemon-mcp",
  version: "1.0.0",
});

server.registerTool(
  "get_pokemon",
  {
    description: "Busca informações de um Pokémon pelo nome ou ID.",
    inputSchema: z.object({
      name: z.string().min(1),
    }),
  },
  async ({ name }) => {
    try {
      const pokemon = await getPokemonTool(name);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(pokemon, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text:
              error instanceof Error
                ? error.message
                : "Erro ao buscar Pokémon.",
          },
        ],
      };
    }
  },
);

server.registerTool(
  "search_pokemon",
  {
    description: "Pesquisa Pokémon pelo nome ou parte do nome.",
    inputSchema: z.object({
      query: z.string().min(1),
    }),
  },
  async ({ query }) => {
    try {
      const pokemon = await searchPokemon(query);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(pokemon, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text:
              error instanceof Error
                ? error.message
                : "Erro ao pesquisar Pokémon.",
          },
        ],
      };
    }
  },
);

server.registerTool(
  "get_pokemon_by_type",
  {
    description: "Lista Pokémon de um determinado tipo.",
    inputSchema: z.object({
      type: z.string().min(1),
    }),
  },
  async ({ type }) => {
    try {
      const result = await getPokemonByType(type);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text:
              error instanceof Error
                ? error.message
                : "Erro ao buscar Pokémon por tipo.",
          },
        ],
      };
    }
  },
);

server.registerTool(
  "get_evolution_chain",
  {
    description: "Retorna a cadeia evolutiva de um Pokémon.",
    inputSchema: z.object({
      name: z.string().min(1),
    }),
  },
  async ({ name }) => {
    try {
      const result = await getEvolutionChain(name);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text:
              error instanceof Error
                ? error.message
                : "Erro ao buscar cadeia evolutiva.",
          },
        ],
      };
    }
  },
);

server.registerTool(
  "get_pokemon_list",
  {
    description: "Retorna uma lista paginada de Pokémon.",
    inputSchema: z.object({
      limit: z.number().int().min(1).max(100).default(20),
      offset: z.number().int().min(0).default(0),
    }),
  },
  async ({ limit, offset }) => {
    try {
      const pokemon = await getPokemonListTool(limit, offset);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(pokemon, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text:
              error instanceof Error
                ? error.message
                : "Erro ao buscar lista de Pokémon.",
          },
        ],
      };
    }
  },
);

server.registerTool(
  "get_pokemon_page",
  {
    description:
      "Retorna uma página de Pokémon com imagem, tipos e todas as estatísticas.",
    inputSchema: z.object({
      limit: z.number().int().min(1).max(20).default(20),
      offset: z.number().int().min(0).default(0),
    }),
  },
  async ({ limit, offset }) => {
    try {
      const result = await getPokemonPage(limit, offset);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text:
              error instanceof Error
                ? error.message
                : "Erro ao buscar página de Pokémon.",
          },
        ],
      };
    }
  },
);

void serveStdio(() => server);
