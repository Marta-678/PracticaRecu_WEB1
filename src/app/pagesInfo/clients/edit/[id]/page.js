"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFetch } from '@/utils/handlerequests';

export default function ClientEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [loadingClient, setLoadingClient] = useState(true);
  const [errorClient, setErrorClient] = useState(null);
  // Datos originales para posible comparación:
  const [originalClient, setOriginalClient] = useState(null);
  // Estado de formulario:
  const [formData, setFormData] = useState({
    name: '',
    cif: '',
    address: {
      street: '',
      number: '',
      postal: '',
      city: '',
      province: '',
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!id) {
      setErrorClient('ID de cliente no proporcionado.');
      setLoadingClient(false);
      return;
    }
    const fetchClient = async () => {
      setLoadingClient(true);
      setErrorClient(null);
      try {
        const data = await getFetch(`api/client/${id}`, null, 'GET', {});
        if (!data) {
          setErrorClient('No se encontraron detalles para el cliente.');
          setOriginalClient(null);
        } else {
          setOriginalClient(data);
          // Inicializar formData con los valores recibidos:
          setFormData({
            name: data.name || '',
            cif: data.cif || '',
            address: {
              street: data.address?.street || '',
              number: data.address?.number ?? '',
              postal: data.address?.postal || '',
              city: data.address?.city || '',
              province: data.address?.province || '',
            },
          });
        }
      } catch (err) {
        console.error("Error al obtener detalles del cliente:", err);
        setErrorClient(err.message || 'Error al obtener detalles del cliente.');
        setOriginalClient(null);
      } finally {
        setLoadingClient(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/pagesInfo/clients');
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
      await getFetch(`api/client/${id}`, payload, 'PUT', {
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

  if (loadingClient) {
    return (
      <div className="loading-text">
        Cargando datos del cliente para edición...
      </div>
    );
  }
  if (errorClient) {
    return (
      <div>
        <p className="error-text">Error: {errorClient}</p>
        <button onClick={handleBack} className="error-back-button">
          ← Volver
        </button>
      </div>
    );
  }
  if (!originalClient) {
    return (
      <div>
        <p>No hay datos de cliente para editar.</p>
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
        <h1>Editar Cliente</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="detail-field" style={{ marginBottom: '12px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '4px' }}>
            Nombre del Cliente:
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

        {/* CIF */}
        <div className="detail-field" style={{ marginBottom: '12px' }}>
          <label htmlFor="cif" style={{ display: 'block', marginBottom: '4px' }}>
            CIF:
          </label>
          <input
            type="text"
            id="cif"
            name="cif"
            value={formData.cif}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Dirección */}
        <fieldset style={{ marginBottom: '16px', padding: '12px', borderRadius: '4px', border: '1px solid #ddd' }}>
          <legend>Dirección</legend>
          {/* Calle */}
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
          {/* Número */}
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
          {/* Código Postal */}
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
          {/* Ciudad */}
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
          {/* Provincia */}
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
          <p className="error-text">Error al guardar: {submitError}</p>
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
