import logo from "./logo.svg";
import {useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Portal from "./pages/Portal/Portal";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail.js";
import Recipe from "./pages/Recipe/Recipe";
import Chefs from "./pages/Chefs/Chefs.js";
import Recipes from "./pages/Recipes/Recipes.js";
import BannedModal from './components/banned/Banned.js';
import "./App.css";

function App() {
  const [isBanned, setIsBanned] = useState(false);
  useEffect(() => {
    // Fetch user info or check ban status from API or token
    const checkBanStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          if (data.isBanned) {
            setIsBanned(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkBanStatus();
  }, []);

   if (isBanned) {
    // Render modal only, block everything else
    return <BannedModal />;
  }
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/recipe" element={<Recipe />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/chefs" element={<Chefs />} />
          <Route path="/recipes" element={<Recipes />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
