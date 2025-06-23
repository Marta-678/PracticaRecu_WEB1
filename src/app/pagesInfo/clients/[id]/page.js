"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFetch } from '@/utils/handlerequests';
import "@/styles/clients.css";
import OrderTable from '@/components/OrderTable';


export default function ClientDetail() {
  const { id } = useParams(); // Extraer el ID desde parámetros dinámicos
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loadingClient, setLoadingClient] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorClient, setErrorClient] = useState(null);
  const [errorProjects, setErrorProjects] = useState(null);

  useEffect(() => {
    if (!id) {
      console.error("El ID no está disponible en los parámetros.");
      setErrorClient('ID de cliente no proporcionado.');
      setLoadingClient(false);
      return;
    }

    const fetchClientDetails = async () => {
      setLoadingClient(true);
      setErrorClient(null);
      try {
        const data = await getFetch(`api/client/${id}`, null, 'GET', {});
        if (!data) {
          setErrorClient('No se encontraron detalles para el cliente.');
          setClient(null);
        } else {
          setClient(data);
        }
      } catch (err) {
        console.error("Error al obtener los detalles del cliente:", err);
        setErrorClient(err.message || 'Error al obtener los detalles del cliente.');
        setClient(null);
      } finally {
        setLoadingClient(false);
      }
    };
    const fetchProjects = async (id) => {
      try {
        const data = await getFetch(`api/project?clientId=${id}`, null, "GET", {});
        setProjects(data);
      } catch (err) {
        setErrorProjects("Error al obtener proyectos:", err.message || err);
      }finally {
        setLoadingProjects(false);
      }
    };

    fetchClientDetails();
    fetchProjects(id);
  }, [id]);

  

  const handleBack = () => {
    router.push('/pagesInfo/clients');
  };

  if (loadingClient) {
  return (
    <p className="loading-text">Cargando los detalles del cliente...</p>
  );
}

if (errorClient) {
  return (
    <div className="detail-container">
      <p className="error-text">Error: {errorClient}</p>
      <button className="error-back-button" onClick={handleBack}>
        ← Volver a la lista
      </button>
    </div>
  );
}

if (!client) {
  return (
    <div className="detail-container">
      <p className="error-text">No se encontraron detalles para el cliente.</p>
      <button className="error-back-button" onClick={handleBack}>
        ← Volver a la lista
      </button>
    </div>
  );
}

  
  // Campos dinámicos basados en la estructura de 'client'
  const fields = [
    { name: "name", label: "Nombre del Cliente", value: client.name },
    { name: "cif", label: "CIF", value: client.cif },
    client.email && { name: "email", label: "Correo Electrónico", value: client.email },
    client.phone && { name: "phone", label: "Teléfono", value: client.phone },
    client.address && client.address.street && { name: "address.street", label: "Calle", value: client.address.street },
    client.address && client.address.number !== undefined && { name: "address.number", label: "Número", value: client.address.number },
    client.address && client.address.postal && { name: "address.postal", label: "Código Postal", value: client.address.postal },
    client.address && client.address.city && { name: "address.city", label: "Ciudad", value: client.address.city },
    client.address && client.address.province && { name: "address.province", label: "Provincia", value: client.address.province },
  ].filter(Boolean);


  return (
    <div className="detail-container">
    <button className="back-button" onClick={handleBack}>
      ← Volver
    </button>

    <div className="detail-header">
      <h1>{client.name}</h1>
    </div>

    <div className="detail-fields">
      {fields.map(field => (
        <p key={field.name} className="detail-field">
          <strong>{field.label}:</strong> {String(field.value)}
        </p>
      ))}
    </div>

    <section className="projects-section">
      <h2>Proyectos relacionados</h2>
      
      {loadingProjects ? (
        <p className="loading-text">Cargando proyectos...</p>
      ) : projects.length === 0 ? (
        <p>No hay proyectos para este cliente.</p>
      ) : (
        <div className="projects-table-wrapper">
          <table className="projects-table">
            <OrderTable orders={projects}></OrderTable>
          </table>
        </div>
      )}
    </section>
  </div>
  );
}


