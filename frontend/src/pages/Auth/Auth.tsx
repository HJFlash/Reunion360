import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí podrías agregar validaciones y autenticación real

    // Por ahora, asumimos login exitoso
    navigate("/dashboard");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí va la lógica de registro (puede ser un alert por ahora)
    alert("Cuenta creada (simulado). Ahora inicia sesión.");
    setIsLogin(true);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="form-side">
          {/* Login */}
          <form
            className={`form ${isLogin ? "visible" : "hidden"}`}
            onSubmit={handleLoginSubmit}
          >
            <h2>Iniciar Sesión</h2>
            <input type="email" placeholder="Correo electrónico" required />
            <input type="password" placeholder="Contraseña" required />
            <button type="submit">Entrar</button>
          </form>

          {/* Register */}
          <form
            className={`form ${!isLogin ? "visible" : "hidden"}`}
            onSubmit={handleRegisterSubmit}
          >
            <h2>Registrarse</h2>
            <input type="email" placeholder="Correo electrónico" required />
            <input type="password" placeholder="Contraseña" required />
            <input type="password" placeholder="Confirmar contraseña" required />
            <button type="submit">Crear cuenta</button>
          </form>
        </div>

        <div className="info-side">
          <h2>{isLogin ? "¿Nuevo aquí?" : "¿Ya tienes cuenta?"}</h2>
          <p>{isLogin ? "Crea una cuenta para comenzar." : "Inicia sesión si ya tienes una."}</p>
          <button
            className="toggle-btn"
            onClick={() => setIsLogin((prev) => !prev)}
            aria-label="Cambiar formulario"
          >
            {isLogin ? "Registrarse" : "Iniciar sesión"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
