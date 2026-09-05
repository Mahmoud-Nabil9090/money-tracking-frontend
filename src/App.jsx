import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IncomeSummary from "./pages/Income/IncomeSummary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/income" element={<IncomeSummary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;