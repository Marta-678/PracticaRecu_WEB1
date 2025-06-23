"use client";

import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { getFetch } from "@/utils/handlerequests";
import "@/styles/header.css";
import ImageWithPopup from "./ImageWithPopup";


export default function Header({ tittle }) {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
     async function fetchUser() {
      try {
        const data = await getFetch("api/user", null, "GET", {});
        setUser(data || []);
      } catch (err) {
        setError(err.message || "Error al obtener los clientes.");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);
  
  return (
    <header className="header">
      <h1 className="title">{tittle}</h1>
      <SearchBar></SearchBar>
      
      <div>
      <h1>{user.email}</h1>

      <ImageWithPopup src={"/img/no-logo.png"} alt={"/img/no-logo.png"} ></ImageWithPopup>
      
      <div/>

      
    </div>
    </header>
  );
}