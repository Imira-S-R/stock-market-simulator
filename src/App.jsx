import NavbarComponent from "./components/NavbarComponent";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home";
import Market from "./pages/Market";
import Transactions from "./pages/Transactions";
import StockPage from "./pages/StockPage";
import LandingPage from "./pages/LandingPage";
import AuthenticationScreen from "./pages/Authentication";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <BrowserRouter>
      <NavbarComponent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/authentication" element={<AuthenticationScreen setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/company-profile" element={<StockPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
