"use client";
import ClientsList from "@/components/ClientsList";
import { useEffect, useState } from "react";
import { getFetch } from "@/utils/handlerequests";
import Link from "next/link";
import "@/styles/clients.css";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener la lista de clientes
  useEffect(() => {
    async function fetchClients() {
      try {
        const data = await getFetch("api/client", null, "GET", {});
        setClients(data || []);
      } catch (err) {
        setError(err.message || "Error al obtener los clientes.");
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  if (loading) return <p className="loading-text">Cargando...</p>;

  return (
    <div className="content-card">
      {error && <p className="error-message">{error}</p>}

      {Array.isArray(clients) && clients.length === 0 ? (
        <div className="no-clients-container">
          <h2 className="no-clients-heading">Crea tu primer Cliente</h2>
          <p className="no-clients-subheading">Para poder generar Albaranes digitales</p>
          <Link href="/pagesInfo/clients/create">
            <button className="cta-button">¡Sí, vamos!</button>
          </Link>
        </div>
      ) : (
        <ClientsList clients={clients} setClients={setClients} />
      )}
    </div>
  );
}
