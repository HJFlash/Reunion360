import React, { useState } from 'react';
import './Auth.css';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="form-side">
          {/* Login */}
          <form
            className={`form ${isLogin ? 'visible' : 'hidden'}`}
            onSubmit={(e) => e.preventDefault()}
          >
            <h2>Iniciar Sesión</h2>
            <input type="email" placeholder="Correo electrónico" required />
            <input type="password" placeholder="Contraseña" required />
            <button type="submit">Entrar</button>
          </form>

          {/* Register */}
          <form
            className={`form ${!isLogin ? 'visible' : 'hidden'}`}
            onSubmit={(e) => e.preventDefault()}
          >
            <h2>Registrarse</h2>
            <input type="email" placeholder="Correo electrónico" required />
            <input type="password" placeholder="Contraseña" required />
            <input type="password" placeholder="Confirmar contraseña" required />
            <button type="submit">Crear cuenta</button>
          </form>
        </div>

        <div className="info-side">
          <h2>{isLogin ? '¿Nuevo aquí?' : '¿Ya tienes cuenta?'}</h2>
          <p>
            {isLogin
              ? 'Crea una cuenta para comenzar.'
              : 'Inicia sesión si ya tienes una.'}
          </p>
          <button
            className="toggle-btn"
            onClick={() => setIsLogin((prev) => !prev)}
            aria-label="Cambiar formulario"
          >
            {isLogin ? 'Registrarse' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
