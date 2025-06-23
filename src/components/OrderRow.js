import Link from 'next/link';
import React from 'react';
import { useState, useEffect } from "react";
import { getFetch } from "@/utils/handlerequests";

export function OrderRow({ order }) {
  const { _id, projectCode, clientId, updatedAt, amount, active } = order;
  const [client, setClient] = useState({});
  const [albaran, setAlbaran] = useState({});

  async function handleDelete() {
    const confirmDelete = confirm(
      `¿Estás seguro de que deseas eliminar el proyecto con ID: ${_id}?`
    );
    if (confirmDelete) {
      try {
        
        await getFetch(`api/project/${_id}`, null, "DELETE", {});
        alert(`Proyecto con ID ${_id} eliminado.`);
        window.location.reload();
      } catch (error) {
        console.error("Error al eliminar proyecto:", error.message);
        alert("No se pudo eliminar el proyecto. Revisa la consola para más detalles.");
      }
    }
  }

  const fetchClient = async () => {
    try {
      const response = await getFetch(`api/client/${clientId}`, null, "GET", {});
      setClient(response);
    } catch (err) {
      console.error("Error al obtener los clientes:", err.message || err);
    }
  };

  const fetchDeliveryNote = async () => {
    try {
      const response = await getFetch(`api/deliverynote/project/${_id}`, null, "GET", {});
      setAlbaran(response);
    } catch (err) {
      console.error("Error al obtener la nota de entrega:", err.message || err);
    }
  };

  useEffect(() => {
    fetchClient();
    fetchDeliveryNote();
  }, [_id, clientId]);

  // Fecha de la orden
  const orderDate = updatedAt ? new Date(updatedAt) : null;
  const now = new Date();

  // Estado según albaran.pending y fecha
  let status = '';
  if (albaran.pending !== undefined && albaran.pending) {
    status = 'PENDING';
  } else if (
    orderDate instanceof Date &&
    !isNaN(orderDate.getTime()) &&
    albaran.pending !== undefined
  ) {
    status = orderDate > now ? 'CANCELED' : 'COMPLETED';
  } else {
    status = 'UNKNOWN';
  }

  // Formateo de fecha
  let formattedDate = '';
  if (orderDate instanceof Date && !isNaN(orderDate.getTime())) {
    try {
      formattedDate = new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(orderDate);
    } catch (e) {
      console.warn("OrderRow: error al formatear fecha:", orderDate, e);
      formattedDate = String(orderDate);
    }
  } else {
    formattedDate = 'Fecha no válida';
  }

  // Formateo de importe
  let formattedAmount = '';
  if (typeof amount === 'number' && !isNaN(amount)) {
    try {
      formattedAmount = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    } catch (e) {
      console.warn("OrderRow: error al formatear cantidad:", amount, e);
      formattedAmount = String(amount);
    }
  } else {
    formattedAmount = '—';
  }

  // Clase de color según status
  let statusClass = '';
  switch (status) {
    case 'CANCELED':
      statusClass = 'text-red-500';
      break;
    case 'PENDING':
      statusClass = 'text-yellow-500';
      break;
    case 'COMPLETED':
      statusClass = 'text-green-500';
      break;
    default:
      statusClass = 'text-gray-500';
  }

  return (
    <tr className="border-b">

      <td className="px-4 py-2 text-sm text-gray-700">
        <Link href={`/pagesInfo/projects/${_id}`}>
          <p>{`#${projectCode}`}</p>
        </Link>
      </td>
      <td className="px-4 py-2 text-sm text-gray-700">{formattedDate}</td>
      <td className="px-4 py-2 flex items-center">
        <Link href={`/pagesInfo/clients/${clientId}`} className="text-sm font-medium text-gray-900">
          <span>{client.name || 'Cargando...'}</span>
        </Link>
      </td>
      <td className="px-4 py-2 text-sm text-gray-700">{formattedAmount}</td>
      <td className={`px-4 py-2 text-sm font-semibold ${statusClass}`}>{status}</td>
      {/* Celda para el botón Eliminar */}
      <td className="px-4 py-2">
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 font-medium"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}
