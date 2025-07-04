import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Bienvenido al Menú Principal</h1>
      <div className="button-group">
        <button onClick={() => navigate("/auth")}>Login / Registro</button>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      </div>
    </div>
  );
};

export default Home;
