import NavbarComponent from "./components/NavbarComponent";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home";
import Market from "./pages/Market";
import Transactions from "./pages/Transactions";
import StockPage from "./pages/StockPage";
import LandingPage from "./pages/LandingPage";
import AuthenticationScreen from "./pages/Authentication";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <BrowserRouter>
      <ToastContainer />
      <NavbarComponent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<LandingPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/authentication" element={<AuthenticationScreen setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/company-profile" element={<StockPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
