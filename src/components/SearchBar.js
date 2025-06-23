"use client";

import { useState, useEffect } from "react";
import { getFetch } from "@/utils/handlerequests";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch clients and projects on mount (optional: you can fetch on demand instead)
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [clientsData, projectsData] = await Promise.all([
          getFetch("api/client", null, "GET", {}),
          getFetch("api/project", null, "GET", {}),
        ]);
        setClients(clientsData || []);
        setProjects(projectsData || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al obtener datos.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Update results when query changes
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const qLower = query.trim().toLowerCase();
    const matchedClients = clients
      .filter((c) => c.name && c.name.toLowerCase().includes(qLower))
      .map((c) => ({ id: c.id, name: c.name, type: "cliente" }));
    const matchedProjects = projects
      .filter((p) => p.name && p.name.toLowerCase().includes(qLower))
      .map((p) => ({ id: p.id, name: p.name, type: "proyecto" }));
    setResults([...matchedClients, ...matchedProjects]);
  }, [query, clients, projects]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="search-container p-4">
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={query}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />
      {loading && <p className="text-gray-500">Cargando datos...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && query && results.length === 0 && (
        <p className="text-gray-500">No se encontraron resultados para </p>
      )}
      <ul className="space-y-2">
        {results.map((item) => (
          <li
            key={`${item.type}-${item.id}`}
            className="p-2 border rounded flex justify-between items-center hover:bg-gray-50"
          >
            <div>
              <span className="font-medium">{item.name}</span>
              <span className="ml-2 text-sm text-gray-500">
                ({item.type === "cliente" ? "Cliente" : "Proyecto"})
              </span>
            </div>
            <Link
              href={
                item.type === "cliente"
                  ? `/pagesInfo/clients/${item._id}`
                  : `/pagesInfo/projects/${item.id}`
              }
            >
              <button className="text-blue-600 hover:underline">Ver</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

