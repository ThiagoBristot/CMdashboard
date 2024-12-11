import React, { useState } from "react";
import "./authform.css";

const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("funcionario");

  const handleLogin = async (e) => {
    e.preventDefault();

    const usuarioLogin = { usuario, senha };
    try {
      const response = await fetch("https://quiet-carefully-elk.ngrok-free.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioLogin),
      });

      if (response.ok) {
        onAuthSuccess();
      } else {
        const errorMessage = await response.text();
        alert(`Erro ao fazer login: ${errorMessage}`);
      }
    } catch (error) {
      alert(`Erro de conexão: ${error.message}`);
      console.error("Erro de conexão:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const novoUsuario = { usuario, senha, cargo };
    try {
      const response = await fetch("https://quiet-carefully-elk.ngrok-free.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario),
      });

      if (response.ok) {
        alert("Usuário registrado com sucesso!");
        setIsLogin(true);
      } else {
        alert("Erro ao registrar usuário.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    }
  };

  return (
    <div className="auth-main-div">
      <header className="auth-main-header"><p>Bem vindo ao <h1>cmdashboard</h1></p></header>
      <div className="auth-container">
        <h2 className="auth-header">{isLogin ? "Login" : "Cadastro de Usuário"}</h2>
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="auth-form">
          <div>
            <label>Nome de Usuário:</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Senha:</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label>Cargo:</label>
              <select
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                required
              >
                <option value="funcionario">Funcionário</option>
                <option value="admin">Administrador</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>
          )}

          <button type="submit">{isLogin ? "Login" : "Registrar"}</button>
        </form>
        <div className="auth-footer">
          <p>
            {isLogin
              ? "Ainda não tem uma conta? "
              : "Já tem uma conta? "}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Registrar" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
