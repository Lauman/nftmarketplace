import React, { useState } from "react";
import "./App.css";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import Menu from "./pages/menu";
import Galery from "./pages/galery";
import CreateItem from "./pages/createItem";
import Home from "./pages/home";
import AuthContext from "./auth/context";
import MyNftsPurchased from "./pages/myNftsPurchased";
function App() {
  const [account, setAccount] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        account,
        setAccount,
      }}
    >
      <div className="container mx-auto">
        {account ? <Menu></Menu> : null}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="galery" element={account ? <Galery /> : <Home />} />
          <Route
            path="createitem"
            element={account ? <CreateItem /> : <Home />}
          />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
