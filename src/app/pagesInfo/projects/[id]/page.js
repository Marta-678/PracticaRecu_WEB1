"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFetch } from '@/utils/handlerequests';
import DeliveryRow from '@/components/DeliveryRow';

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState(null);
  const [deliveryNotes, setdeliveryNotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      console.error("El ID no está disponible en los parámetros.");
      setError('ID de proyecto no proporcionado.');
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFetch(`api/project/one/${id}`, null, 'GET', {});
        if (!data) {
          setError('No se encontraron detalles para el proyecto.');
          setProject(null);
        } else {
          setProject(data);
        }
      } catch (err) {
        console.error("Error al obtener los detalles del proyecto:", err);
        setError(err.message || 'Error al obtener los detalles del proyecto.');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchDeliveryNote = async () => {
      try {
        const response = await getFetch(`api/deliverynote/project/${id}`, null, "GET", {});
        setdeliveryNotes(response);
      } catch (err) {
        console.error("Error al obtener los clientes:", err.message || err);
      }
    };

    fetchProject();
    fetchDeliveryNote();
  }, [id]);

  const handleBack = () => {
    router.push('/pagesInfo/projects');
  };

  const handleEdit = () => {
    router.push(`/pagesInfo/projects/edit/${id}`);
  };

  if (loading) {
    return (
      <p className="loading-text">Cargando los detalles del proyecto...</p>
    );
  }

  if (error) {
    return (
      <div className="detail-container">
        <p className="error-text">Error: {error}</p>
        <button className="error-back-button" onClick={handleBack}>
          ← Volver a la lista
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="detail-container">
        <p className="error-text">No se encontraron detalles para el proyecto.</p>
        <button className="error-back-button" onClick={handleBack}>
          ← Volver a la lista
        </button>
      </div>
    );
  }

  const fields = [
    project.name && { name: "name", label: "Nombre del Proyecto", value: project.name },
    project.projectCode && { name: "projectCode", label: "Código del Proyecto", value: project.projectCode },
    project.code && { name: "code", label: "Código Interno", value: project.code },
    project.clientId && { name: "clientId", label: "ID del Cliente", value: project.clientId },
    project.userId && { name: "userId", label: "ID de Usuario", value: project.userId },
    project.address && project.address.street && {
      name: "address.street",
      label: "Calle",
      value: project.address.street
    },
    project.address && project.address.number !== undefined && {
      name: "address.number",
      label: "Número",
      value: project.address.number
    },
    project.address && project.address.postal && {
      name: "address.postal",
      label: "Código Postal",
      value: project.address.postal
    },
    project.address && project.address.city && {
      name: "address.city",
      label: "Ciudad",
      value: project.address.city
    },
    project.address && project.address.province && {
      name: "address.province",
      label: "Provincia",
      value: project.address.province
    },
    project.createdAt && {
      name: "createdAt",
      label: "Creado",
      value: project.createdAt
    },
    project.updatedAt && {
      name: "updatedAt",
      label: "Última actualización",
      value: project.updatedAt
    },
  ].filter(Boolean);

  return (
    <div className="detail-container">
      <button className="back-button" onClick={handleBack}>
        ← Volver
      </button>

      <div className="detail-header">
        <h1>{project.name || 'Proyecto'}</h1>
      </div>

      <div className="detail-fields">
        {fields.map(field => (
          <p key={field.name} className="detail-field">
            <strong>{field.label}:</strong> {String(field.value)}
          </p>
        ))}
      </div>

      <button className="primary-button" onClick={handleEdit}>
        Editar
      </button>

      <section className="projects-section">
        <h2>Albaranes relacionados</h2>
        
        {deliveryNotes && deliveryNotes.length > 0 && (
          <div className="orders-list">
            {deliveryNotes.map((deliveryNote) => (
              <DeliveryRow
                key={deliveryNote._id}
                item={deliveryNote}
              />
            ))}
          </div>
        )}
      </section>  
    </div>
  );
}
