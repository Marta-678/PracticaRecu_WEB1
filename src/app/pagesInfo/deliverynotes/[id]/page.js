"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFetch } from '@/utils/handlerequests';

export default function DeliveryNoteDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [deliveryNote, setDeliveryNote] = useState(null);
  const [clientName, setClientName] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) {
      console.error("El ID no está disponible en los parámetros.");
      setError('ID de la delivery note no proporcionado.');
      setLoading(false);
      return;
    }

    const fetchDeliveryNote = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFetch(`api/deliverynote/${id}`, null, 'GET', {});
        if (!data) {
          setError('No se encontró la delivery note.');
          setDeliveryNote(null);
          setLoading(false);
          return;
        }
        setDeliveryNote(data);

        if (data.clientId) {
          try {
            const clientData = await getFetch(`api/client/${data.clientId}`, null, 'GET', {});
            setClientName(clientData?.name || null);
          } catch (err) {
            console.error("Error al obtener nombre de cliente:", err);
            setClientName(null);
          }
        }
        if (data.projectId) {
          try {
            const projectData = await getFetch(`api/project/one/${data.projectId}`, null, 'GET', {});
            setProjectName(projectData?.name || null);
          } catch (err) {
            console.error("Error al obtener nombre de proyecto:", err);
            setProjectName(null);
          }
        }
      } catch (err) {
        console.error("Error al obtener la delivery note:", err);
        setError(err.message || 'Error al obtener la delivery note.');
        setDeliveryNote(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryNote();
  }, [id]);


  const handleBack = () => {
    router.push('/pagesInfo/deliverynotes');
  };

  const handleEdit = () => {
    router.push(`/pagesInfo/deliverynotes/edit/${id}`);
  };

  const handlePDF = async () => {
    if (!id) {
      alert('ID de la delivery note no está disponible.');
      return;
    }

    setDownloading(true);
    setError(null);

    try {
      // 1. PATCH: dispara la generación/preparación del PDF en el backend
      // Si getFetch devuelve JSON con info relevante, puedes capturarla; si no, simplemente esperas que termine.
      await getFetch(`api/deliverynote/pdf/${id}`, null, 'PATCH', {});

      // 2. GET: descarga el PDF como blob
      const response = await getFetch(`api/deliverynote/pdf/${id}`, null, 'GET', {});
      if (!response.ok) {
        throw new Error(`Error en la descarga: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();

      // 3. Crear URL de descarga
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Nombre del archivo; ajústalo según prefieras
      a.download = `deliverynote-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Liberar el objeto URL después de un pequeño delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      console.error("Error al descargar el PDF:", err);
      alert('Ha ocurrido un error al descargar el PDF: ' + (err.message || 'Error inesperado.'));
      setError(err.message || 'Error al descargar el PDF.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <p className="loading-text">Cargando la Delivery Note...</p>
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

  if (!deliveryNote) {
    return (
      <div className="detail-container">
        <p className="error-text">No se encontró la Delivery Note.</p>
        <button className="error-back-button" onClick={handleBack}>
          ← Volver a la lista
        </button>
      </div>
    );
  }

  const fields = [
    deliveryNote._id && { name: "_id", label: "ID", value: deliveryNote._id },
    deliveryNote.clientId && {
      name: "clientId",
      label: "Cliente",
      value: clientName ? `${clientName} (${deliveryNote.clientId})` : deliveryNote.clientId
    },
    deliveryNote.projectId && {
      name: "projectId",
      label: "Proyecto",
      value: projectName ? `${projectName} (${deliveryNote.projectId})` : deliveryNote.projectId
    },
    deliveryNote.format && {
      name: "format",
      label: "Formato",
      value: deliveryNote.format
    },
    deliveryNote.format === "material" && deliveryNote.material && {
      name: "material",
      label: "Tipo de Material",
      value: deliveryNote.material
    },
    deliveryNote.format === "hours" && (deliveryNote.hours !== undefined) && {
      name: "hours",
      label: "Horas",
      value: String(deliveryNote.hours)
    },
    deliveryNote.description && {
      name: "description",
      label: "Descripción",
      value: deliveryNote.description
    },
    deliveryNote.workdate && {
      name: "workdate",
      label: "Fecha de Trabajo",
      value: deliveryNote.workdate
    },
    deliveryNote.createdAt && {
      name: "createdAt",
      label: "Creado",
      value: deliveryNote.createdAt
    },
    deliveryNote.updatedAt && {
      name: "updatedAt",
      label: "Última actualización",
      value: deliveryNote.updatedAt
    }
  ].filter(Boolean);

  return (
    <div className="detail-container">
      <button className="back-button" onClick={handleBack}>
        ← Volver
      </button>

      <div className="detail-header">
        <h1>Delivery Note {deliveryNote._id || ''}</h1>
      </div>

      <div className="detail-fields">
        {fields.map(field => (
          <p key={field.name} className="detail-field">
            <strong>{field.label}:</strong> {String(field.value)}
          </p>
        ))}
      </div>

      <div className="detail-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

        <button className="primary-button" onClick={handleEdit}>
          Editar
        </button>
        {/* <button className="primary-button" onClick={handlePDF}>
          Descargar PDF
        </button> */}
      </div>
    </div>
  );
}
