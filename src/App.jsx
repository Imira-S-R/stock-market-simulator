import NavbarComponent from "./components/NavbarComponent";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home";
import Market from "./pages/Market";
import Transactions from "./pages/Transactions";
import StockPage from "./pages/StockPage";
import LandingPage from "./pages/LandingPage";

function App() {

  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/company-profile" element={<StockPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
