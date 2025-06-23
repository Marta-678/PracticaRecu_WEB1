// Esta línea indica que este archivo debe ejecutarse en el cliente, no en el servidor
"use client";
import { useState, useEffect } from "react";
// useState: permite agregar y manejar un estado interno en un componente funcional
// useEffecy: maneja efectos secundarios en componentes funcionales Los efectos secundarios son tareas que ocurren fuera del flujo de renderizado, como: Llamadas a APIs., Manipulación del DOM, Suscripciones a eventos o servicios. Limpieza de recursos (como desuscribir eventos o detener intervalos)

import LoginUser from "./user/onBoarding/login/page";
import Register from "./user/onBoarding/register/page";
import Validation from "./user/onBoarding/validation/page";
import TokenService from "@/utils/TokenService";


import PageLayout from "./pagesInfo/layout";
import Clients from "./pagesInfo/clients/page";
import "@/styles/home.css";

export default function Home() {
  const [view, setView] = useState("login");

  useEffect(() => {
    //al iniciar se intenta ptener el token 
    const token = TokenService.getToken();
    console.log("Home useEffect, token detectado:", token);
    if (token) {
      setView("pages"); 
    }
    
  }, []);

  const handleLogin = (newToken) => {
   console.log("handleLogin recibido newToken:", newToken);
    if (newToken) {
      TokenService.setToken(newToken);
    }
    setView("pages");
  };

  const handleLogout = () => {
    TokenService.clearToken(); 
    setView("login");
  };

  return (
    <div className="home-container">
      <div className="view-container">
        {view === "login" && (
  
          <LoginUser
            onLogin={(token) => handleLogin(token)}
            onRegisterClick={() => setView("register")}
          />
        )}

        {view === "register" && (
          <Register
            onRegister={() => setView("verification")}
            onLoginClick={() => setView("login")}
          />
        )}

        {view === "verification" && (
          <Validation onValidation={() => setView("pages")} />
        )}

        {view === "pages" && (
          <PageLayout onLogout={handleLogout}>
            <Clients />
          </PageLayout>
        )}
      </div>
    </div>
  );
}

