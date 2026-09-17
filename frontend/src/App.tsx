import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import ComparisonPage from "./pages/ComparisonPage";
import EvolutionPage from "./pages/EvolutionPage";
import AIResultPage from "./pages/AIResultPage";
import PokemonResultPage from "./pages/PokemonResultPage";
import TypeResultPage from "./pages/TypeResultPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/ai" element={<ChatPage />} />

        <Route path="/type-result" element={<TypeResultPage />} />

        <Route path="/pokemon-result" element={<PokemonResultPage />} />

        <Route path="/comparison" element={<ComparisonPage />} />

        <Route path="/evolution" element={<EvolutionPage />} />

        <Route path="/ai-result" element={<AIResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
