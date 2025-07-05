import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailInput = (e.target as HTMLFormElement).querySelector(
      'input[type="email"]'
    ) as HTMLInputElement;
    const passwordInput = (e.target as HTMLFormElement).querySelector(
      'input[type="password"]'
    ) as HTMLInputElement;

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar usuario y token
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/dashboard");
      } else {
        alert(data.error || "Error al iniciar sesión.");
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailInput = (e.target as HTMLFormElement).querySelector(
      'input[type="email"]'
    ) as HTMLInputElement;
    const passwordInput = (e.target as HTMLFormElement).querySelector(
      'input[type="password"]'
    ) as HTMLInputElement;

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: "Nuevo Usuario",
          email,
          password,
          role: "organizador" // o "asistente"
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cuenta creada. Ahora inicia sesión.");
        setIsLogin(true);
      } else {
        alert(data.error || "Error al registrarse.");
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    }
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
