import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Study from "./pages/Study";
import { Collection } from "./pages/Collection";
import { Gacha } from "./pages/Gacha"; 
import Flashcards from "./pages/MyFlashcards";
import { Profile } from "./pages/Profile";
import Create from "./pages/EditCards";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/study" element={<Study />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/gacha" element={<Gacha />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </div>
  );
}

export default App;
