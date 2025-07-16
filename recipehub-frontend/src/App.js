import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import HomePage from './pages/HomePage/HomePage'
import Portal from './pages/Portal/Portal'
import Recipe from './pages/Recipe/Recipe'
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/portal" element={<Portal />}/>
          <Route path="/recipe" element={<Recipe />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
