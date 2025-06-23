"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFetch } from '@/utils/handlerequests';

export default function ProjectEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [originalProject, setOriginalProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    projectCode: '',
    code: '',
    // clientId: '',
    // userId: '',
    address: {
      street: '',
      number: '',
      postal: '',
      city: '',
      province: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!id) {
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
          setOriginalProject(null);
        } else {
          setOriginalProject(data);
          setFormData({
            name: data.name || '',
            projectCode: data.projectCode || '',
            code: data.code || '',
            // clientId: data.clientId != null ? String(data.clientId) : '',
            // userId: data.userId != null ? String(data.userId) : '',
            address: {
              street: data.address?.street || '',
              number: data.address?.number != null ? String(data.address.number) : '',
              postal: data.address?.postal || '',
              city: data.address?.city || '',
              province: data.address?.province || '',
            },
          });
        }
      } catch (err) {
        console.error("Error al obtener detalles del proyecto:", err);
        setError(err.message || 'Error al obtener los detalles del proyecto.');
        setOriginalProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/pagesInfo/projects');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        ...formData,
      };
      await getFetch(`api/project/${id}`, payload, 'PUT', {
        'Content-Type': 'application/json'
      });
      handleBack();
    } catch (err) {
      console.error("Error al actualizar cliente:", err);
      setSubmitError(err.message || 'Error al actualizar cliente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-text">
        Cargando datos del proyecto para edición...
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p className="error-text">Error: {error}</p>
        <button onClick={handleBack} className="error-back-button">
          ← Volver
        </button>
      </div>
    );
  }
  if (!originalProject) {
    return (
      <div>
        <p>No hay datos de proyecto para editar.</p>
        <button onClick={handleBack} className="back-button">
          ← Volver
        </button>
      </div>
    );
  }

  return (
    <div className="edit-container">
      <button onClick={handleBack} className="back-button">
        ← Volver
      </button>

      <div className="detail-header">
        <h1>Editar Proyecto</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Nombre del Proyecto */}
        <div className="detail-field" style={{ marginBottom: '12px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '4px' }}>
            Nombre del Proyecto:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Código del Proyecto */}
        <div className="detail-field" style={{ marginBottom: '12px' }}>
          <label htmlFor="projectCode" style={{ display: 'block', marginBottom: '4px' }}>
            Código del Proyecto:
          </label>
          <input
            type="text"
            id="projectCode"
            name="projectCode"
            value={formData.projectCode}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Código Interno */}
        <div className="detail-field" style={{ marginBottom: '12px' }}>
          <label htmlFor="code" style={{ display: 'block', marginBottom: '4px' }}>
            Código Interno:
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* ID del Cliente */}
        {/* <div className="detail-field" style={{ marginBottom: '12px' }}>
          <label htmlFor="clientId" style={{ display: 'block', marginBottom: '4px' }}>
            ID del Cliente:
          </label>
          <input
            type="text"
            id="clientId"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div> */}

        {/* ID de Usuario */}
        {/* <div className="detail-field" style={{ marginBottom: '12px' }}>
          <label htmlFor="userId" style={{ display: 'block', marginBottom: '4px' }}>
            ID de Usuario:
          </label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div> */}

        {/* Dirección */}
        <fieldset style={{ marginBottom: '16px', padding: '12px', borderRadius: '4px', border: '1px solid #ddd' }}>
          <legend>Dirección</legend>
          <div className="detail-field" style={{ marginBottom: '12px' }}>
            <label htmlFor="address.street" style={{ display: 'block', marginBottom: '4px' }}>
              Calle:
            </label>
            <input
              type="text"
              id="address.street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div className="detail-field" style={{ marginBottom: '12px' }}>
            <label htmlFor="address.number" style={{ display: 'block', marginBottom: '4px' }}>
              Número:
            </label>
            <input
              type="number"
              id="address.number"
              name="address.number"
              value={formData.address.number}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div className="detail-field" style={{ marginBottom: '12px' }}>
            <label htmlFor="address.postal" style={{ display: 'block', marginBottom: '4px' }}>
              Código Postal:
            </label>
            <input
              type="text"
              id="address.postal"
              name="address.postal"
              value={formData.address.postal}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div className="detail-field" style={{ marginBottom: '12px' }}>
            <label htmlFor="address.city" style={{ display: 'block', marginBottom: '4px' }}>
              Ciudad:
            </label>
            <input
              type="text"
              id="address.city"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div className="detail-field" style={{ marginBottom: '12px' }}>
            <label htmlFor="address.province" style={{ display: 'block', marginBottom: '4px' }}>
              Provincia:
            </label>
            <input
              type="text"
              id="address.province"
              name="address.province"
              value={formData.address.province}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </fieldset>

        {submitError && (
          <p className="error-text" style={{ marginBottom: '12px' }}>
            Error al guardar: {submitError}
          </p>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={handleBack}
            disabled={submitting}
            className="edit-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="primary-button"
          >
            {submitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
