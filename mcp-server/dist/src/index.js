import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { getPokemon } from "./pokeapi.js";
const server = new McpServer({
    name: "pokemon-mcp",
    version: "1.0.0"
});
server.registerTool("get_pokemon", {
    description: "Busca informações de um Pokémon pelo nome ou ID.",
    inputSchema: z.object({
        name: z.string().min(1)
    })
}, async ({ name }) => {
    try {
        const pokemon = await getPokemon(name);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(pokemon, null, 2)
                }
            ]
        };
    }
    catch (error) {
        return {
            isError: true,
            content: [
                {
                    type: "text",
                    text: error instanceof Error
                        ? error.message
                        : "Erro ao buscar Pokémon."
                }
            ]
        };
    }
});
void serveStdio(() => server);
