# 🧠 ProjectPoke

Aplicação web de consulta de Pokémon integrada com **Inteligência Artificial, MCP (Model Context Protocol), Ollama, Qwen3 e PokéAPI**.

O projeto foi desenvolvido com o objetivo de estudar na prática como um **Agent de IA pode utilizar ferramentas externas através do MCP**, além de integrar esse fluxo a uma aplicação web construída com React e TypeScript.

---

## 📌 Sobre o projeto

O ProjectPoke é uma Pokédex que permite consultar informações sobre Pokémon e também conversar com um assistente de IA.

A IA consegue interpretar perguntas do usuário e decidir qual ferramenta MCP deve utilizar para obter as informações necessárias.

Exemplos de perguntas:

```text
Fale mais sobre Charmeleon.

Quem é mais forte, Blastoise ou Charizard?

Quero a escala evolutiva do Bulbasaur.

Quais Pokémon são do tipo fogo?
```

A aplicação possui diferentes interfaces dependendo da intenção identificada pelo Agent.

---

## 🏗️ Arquitetura

A aplicação é dividida em três partes principais:

```text
ProjectPoke
│
├── agent
├── frontend
└── mcp-server
```

Fluxo principal:

```text
                    Usuário
                       │
                       ▼
                React / Frontend
                  localhost:5173
                       │
                    HTTP
                       │
                       ▼
                 Express / Agent
                  localhost:3000
                       │
                       ▼
                Qwen3 + Ollama
                       │
                       ▼
                  MCP Client
                       │
                       ▼
                  MCP Server
                       │
                       ▼
                    PokéAPI
```

### Responsabilidade de cada camada

**Frontend**

Responsável pela interface da aplicação e pela apresentação dos dados recebidos do backend.

**Agent**

Interpreta a pergunta do usuário, identifica a intenção e decide quais ferramentas MCP devem ser utilizadas.

**MCP Client**

Responsável pela conexão entre o Agent e o MCP Server.

**MCP Server**

Disponibiliza ferramentas que podem ser utilizadas pelo Agent para consultar a PokéAPI.

**PokéAPI**

Fonte dos dados dos Pokémon.

---

# 🚀 Tecnologias utilizadas

## Frontend

* React
* TypeScript
* Vite
* React Router DOM
* CSS

## Backend / Agent

* Node.js
* TypeScript
* Express
* CORS
* OpenAI Agents SDK
* Zod

## Inteligência Artificial

* Ollama
* Qwen3

## MCP

* Model Context Protocol
* `@modelcontextprotocol/server`
* MCP via STDIO

## API externa

* PokéAPI

---

# 📁 Estrutura do projeto

```text
ProjectPoke/
│
├── agent/
│   ├── src/
│   │   └── index.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── PokemonCard.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ChatPage.tsx
│   │   │   ├── PokemonResultPage.tsx
│   │   │   ├── ComparisonPage.tsx
│   │   │   ├── EvolutionPage.tsx
│   │   │   ├── TypeResultPage.tsx
│   │   │   └── AIResultPage.tsx
│   │   │
│   │   ├── services/
│   │   │   ├── pokemon.ts
│   │   │   └── agent.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── tsconfig.json
│
└── mcp-server/
    ├── src/
    │   ├── index.ts
    │   ├── pokeapi.ts
    │   │
    │   └── tools/
    │       ├── getPokemon.ts
    │       ├── searchPokemon.ts
    │       ├── getPokemonByType.ts
    │       ├── getEvolutionChain.ts
    │       ├── getPokemonList.ts
    │       └── getPokemonPage.ts
    │
    ├── package.json
    └── tsconfig.json
```

---

# 🤖 Funcionamento do Agent

O Agent foi configurado para trabalhar exclusivamente com perguntas relacionadas a Pokémon.

Ele possui diferentes tipos de resposta:

```text
pokemon
comparison
evolution
type
other
```

### Pokémon

Perguntas sobre um Pokémon específico.

Exemplo:

```text
Fale mais sobre Charmeleon.
```

O Agent utiliza:

```text
get_pokemon
```

e retorna:

```json
{
  "view": "pokemon",
  "answer": "...",
  "pokemonNames": [
    "charmeleon"
  ]
}
```

---

### Comparação

Perguntas comparando dois ou mais Pokémon.

Exemplo:

```text
Quem é mais forte, Blastoise ou Charizard?
```

O Agent utiliza:

```text
get_pokemon
```

para cada Pokémon envolvido.

A resposta possui:

```json
{
  "view": "comparison",
  "answer": "...",
  "pokemonNames": [
    "blastoise",
    "charizard"
  ]
}
```

---

### Evolução

Perguntas relacionadas à cadeia evolutiva.

Exemplo:

```text
Quero a escala evolutiva do Bulbasaur.
```

O Agent utiliza:

```text
get_evolution_chain
```

Resultado:

```json
{
  "view": "evolution",
  "answer": "...",
  "pokemonNames": [
    "bulbasaur",
    "ivysaur",
    "venusaur"
  ]
}
```

---

### Tipo

Perguntas relacionadas a tipos de Pokémon.

Exemplo:

```text
Quais Pokémon são do tipo fogo?
```

O Agent utiliza:

```text
get_pokemon_by_type
```

---

### Other

Perguntas fora do universo Pokémon.

Exemplo:

```text
Qual é a capital da França?
```

Nesse caso, o Agent não utiliza ferramentas Pokémon e retorna uma resposta informando que o sistema responde somente perguntas relacionadas a Pokémon.

---

# 🔌 MCP

O projeto utiliza o **Model Context Protocol (MCP)** para permitir que o Agent utilize ferramentas externas de maneira padronizada.

O MCP Server disponibiliza as seguintes ferramentas:

| Tool                  | Função                                               |
| --------------------- | ---------------------------------------------------- |
| `get_pokemon`         | Busca informações de um Pokémon                      |
| `search_pokemon`      | Pesquisa Pokémon pelo nome                           |
| `get_pokemon_by_type` | Lista Pokémon de um determinado tipo                 |
| `get_evolution_chain` | Retorna a cadeia evolutiva                           |
| `get_pokemon_list`    | Retorna uma lista paginada                           |
| `get_pokemon_page`    | Retorna uma página com dados completos para os cards |

---

# 🔄 Fluxo MCP

Quando o usuário pergunta:

```text
Quero a escala evolutiva do Bulbasaur.
```

o fluxo é:

```text
Usuário
   ↓
Frontend
   ↓
POST /chat
   ↓
Agent
   ↓
Qwen3
   ↓
Identifica intenção: evolution
   ↓
MCP Client
   ↓
get_evolution_chain
   ↓
MCP Server
   ↓
PokéAPI
   ↓
Dados da evolução
   ↓
Agent
   ↓
Express
   ↓
Frontend
   ↓
EvolutionPage
```

---

# 🧰 Ferramentas MCP

## `get_pokemon`

Busca um Pokémon pelo nome ou ID.

Exemplo:

```text
get_pokemon("pikachu")
```

Retorna informações como:

* ID
* nome
* altura
* peso
* tipos
* habilidades
* imagem
* HP
* ataque
* defesa
* ataque especial
* defesa especial
* velocidade

---

## `search_pokemon`

Pesquisa Pokémon pelo nome ou parte dele.

Exemplo:

```text
search_pokemon("char")
```

Pode retornar:

```text
charizard
charmeleon
charcadet
...
```

---

## `get_pokemon_by_type`

Busca Pokémon de um determinado tipo.

Exemplo:

```text
get_pokemon_by_type("fire")
```

---

## `get_evolution_chain`

Busca a cadeia evolutiva de um Pokémon.

O processo envolve:

```text
Pokémon
   ↓
Species
   ↓
Evolution Chain
```

Por exemplo:

```text
Bulbasaur
   ↓
Ivysaur
   ↓
Venusaur
```

---

## `get_pokemon_list`

Retorna uma lista paginada de Pokémon.

Recebe:

```text
limit
offset
```

Exemplo:

```text
limit = 20
offset = 40
```

significa:

> Buscar 20 Pokémon pulando os primeiros 40.

---

## `get_pokemon_page`

Retorna uma página de Pokémon já com os dados necessários para os cards do frontend.

Além da paginação, retorna:

* imagem
* tipos
* estatísticas
* ID
* nome

---

# 🌐 API do Agent

O backend utiliza Express e disponibiliza as seguintes rotas.

## `GET /health`

Verifica se a API está funcionando.

Resposta:

```json
{
  "status": "ok",
  "service": "pokemon-agent"
}
```

---

## `GET /pokemon`

Retorna uma página de Pokémon.

Exemplo:

```text
GET /pokemon?limit=20&offset=0
```

---

## `GET /pokemon/:name`

Busca um Pokémon específico.

Exemplo:

```text
GET /pokemon/pikachu
```

---

## `POST /chat`

Envia uma pergunta para o Agent.

Exemplo:

```json
{
  "message": "Quem é mais forte, Blastoise ou Charizard?"
}
```

Resposta:

```json
{
  "view": "comparison",
  "answer": "...",
  "pokemon": []
}
```

---

# 🖥️ Frontend

O frontend possui diferentes páginas para representar cada tipo de resultado da IA.

| Rota              | Página              | Função                          |
| ----------------- | ------------------- | ------------------------------- |
| `/`               | `HomePage`          | Pokédex principal               |
| `/ai`             | `ChatPage`          | Chat com a IA                   |
| `/pokemon-result` | `PokemonResultPage` | Resultado de Pokémon específico |
| `/comparison`     | `ComparisonPage`    | Comparação entre Pokémon        |
| `/evolution`      | `EvolutionPage`     | Cadeia evolutiva                |
| `/type-result`    | `TypeResultPage`    | Pokémon por tipo                |
| `/ai-result`      | `AIResultPage`      | Respostas fora do contexto      |

---

# ⚙️ Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

* Node.js
* npm
* Ollama
* Qwen3

---

# 🧠 Configurando o Ollama

Instale o Ollama e baixe o modelo utilizado pelo projeto:

```bash
ollama pull qwen3:latest
```

Depois verifique se o Ollama está funcionando:

```bash
ollama list
```

O modelo utilizado pelo projeto é:

```text
qwen3:latest
```

---

# 📦 Instalação

Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre no projeto:

```bash
cd ProjectPoke
```

Depois instale as dependências de cada parte.

### MCP Server

```bash
cd mcp-server
npm install
```

### Agent

```bash
cd ../agent
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

# 🔐 Configuração do Agent

Dentro da pasta:

```text
agent/
```

crie um arquivo:

```text
.env
```

com:

```env
OLLAMA_BASE_URL=http://localhost:11434/v1/
OLLAMA_API_KEY=ollama
OLLAMA_MODEL=qwen3:latest
```

---

# ▶️ Executando o projeto

## 1. Inicie o Ollama

Verifique se o serviço está disponível:

```bash
ollama list
```

---

## 2. Inicie o Agent

Entre na pasta:

```bash
cd agent
```

Execute:

```bash
npm run dev
```

O Agent deverá iniciar em:

```text
http://localhost:3000
```

O próprio Agent inicia e conecta o MCP Server através de STDIO.

---

## 3. Inicie o Frontend

Em outro terminal:

```bash
cd frontend
```

Execute:

```bash
npm run dev
```

O frontend estará disponível normalmente em:

```text
http://localhost:5173
```

---

# 🧪 Testando a API

### Health Check

```bash
curl http://localhost:3000/health
```

### Buscar Pokémon

```bash
curl http://localhost:3000/pokemon/pikachu
```

### Buscar lista

```bash
curl "http://localhost:3000/pokemon?limit=20&offset=0"
```

### Testar Agent

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Fale mais sobre Charmeleon"}'
```

---

# 🔗 Integração entre as tecnologias

O projeto demonstra uma integração entre:

```text
React
 ↓
Express
 ↓
OpenAI Agents SDK
 ↓
Ollama
 ↓
Qwen3
 ↓
MCP Client
 ↓
MCP Server
 ↓
PokéAPI
```

Cada tecnologia possui uma responsabilidade específica.

### React

Constrói a interface.

### Express

Cria a API HTTP que conecta o frontend ao Agent.

### OpenAI Agents SDK

Gerencia o Agent, seu modelo e as ferramentas MCP.

### Ollama

Executa o modelo de linguagem localmente.

### Qwen3

Responsável pelo processamento da linguagem natural e tomada de decisão do Agent.

### MCP

Padroniza a comunicação entre o Agent e as ferramentas externas.

### PokéAPI

Fornece os dados dos Pokémon.

---

# 🎯 Objetivos do projeto

Este projeto foi desenvolvido principalmente para estudar e praticar:

* Desenvolvimento de APIs com Node.js e Express
* React com TypeScript
* React Router
* Consumo de APIs externas
* Inteligência Artificial local
* Ollama
* Qwen3
* OpenAI Agents SDK
* Model Context Protocol
* MCP Server
* MCP Client
* Tool Calling
* Structured Output
* Zod
* Arquitetura de aplicações com IA

---

# 📚 Conceito principal

O principal objetivo do projeto é demonstrar que um Agent de IA não precisa obter todas as informações apenas através do conhecimento do modelo.

Em vez disso, o Agent pode:

```text
interpretar a pergunta
        ↓
identificar a intenção
        ↓
escolher uma ferramenta
        ↓
executar a ferramenta via MCP
        ↓
obter dados externos
        ↓
interpretar os resultados
        ↓
retornar uma resposta estruturada
```

Dessa forma, o modelo funciona como um **orquestrador**, enquanto as ferramentas fornecem os dados necessários para a aplicação.

---

# 👨‍💻 Autor

**Lucas Alvarenga**

Projeto desenvolvido para estudos de desenvolvimento web, Inteligência Artificial, Agents e Model Context Protocol.
