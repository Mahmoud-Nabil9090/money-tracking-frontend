import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IncomeSummary from "./pages/Income/IncomeSummary";
import NewIncomePage from "./pages/Income/IncomeForm";
import EditIncomePage from "./pages/Income/EditIncome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/income" element={<IncomeSummary />} />
         <Route path="/income/new" element={<NewIncomePage />} />
        <Route path="/income/:id/edit" element={<EditIncomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;