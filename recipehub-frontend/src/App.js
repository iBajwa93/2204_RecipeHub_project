<<<<<<< Updated upstream
import logo from './logo.svg';
import HomePage from './pages/HomePage/HomePage'
import './App.css';
=======
import logo from "./logo.svg";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Portal from "./pages/Portal/Portal";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail";
import "./App.css";
>>>>>>> Stashed changes

function App() {
  return (
    <div className="App">
<<<<<<< Updated upstream
      <HomePage />
=======
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </Router>
>>>>>>> Stashed changes
    </div>
  );
}

export default App;
