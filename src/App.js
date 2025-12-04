import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
