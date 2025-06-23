"use client";

import ProjectsList from "@/components/ProjectsList";
import { useEffect, useState } from "react";
import { getFetch } from "@/utils/handlerequests";
import Link from "next/link";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        async function fetchProjects() {
          try {
            const data = await getFetch("api/project", null, "GET", {});
            setProjects(data || []);
          } catch (err) {
            setError(err.message || "Error al obtener los clientes.");
          } finally {
            setLoading(false);
          }
        }
    
        fetchProjects();
      }, []);
    
      if (loading) return <p>Cargando...</p>;
    
      return (
        <div>
          {error && <p className="error">{error}</p>}
    
          {Array.isArray(projects) && projects.length === 0 ? (
            <div className="no-projects">
              <h2>Crea tu primer Proyecto</h2>
              <p>Para poder generar Proyectos digitales</p>
              <Link href="/pagesInfo/projects/create">
                <button className="">¡Sí, vamos!</button>
              </Link>
            </div>
          ) : (
            <ProjectsList projects={projects} setProjects={setProjects} />
          )}
        </div>
      );
    }
    