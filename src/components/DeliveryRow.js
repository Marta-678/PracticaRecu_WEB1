"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getFetch } from "@/utils/handlerequests";

export default function DeliveryRow({ 
  item, 
  isSelected = false, 
  onToggleSelect, 
  locale = "en-US" 
}) {
  const id = item._id ?? item.id;

  async function handleDelete() {
    const confirmDelete = confirm(
      `¿Estás seguro de que deseas eliminar la nota de entrega con ID: ${id}?`
    );
    if (confirmDelete) {
      try {
        await getFetch(`api/deliverynote/${id}`, null, "DELETE", {});
        alert(`Nota de entrega con ID ${id} eliminada.`);
        window.location.reload();
      } catch (error) {
        console.error("Error al eliminar nota de entrega:", error.message);
        alert("No se pudo eliminar la nota de entrega. Revisa la consola para más detalles.");
      }
    }
  }

  const formatDateTime = (dateInput) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (isNaN(d)) return String(dateInput);
    return d.toLocaleString(locale, {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getStatusClasses = (status) => {
    if (!status) return "text-gray-500";
    const s = status.toString().toLowerCase();
    if (s === "completed" || s === "complete" || s === "done") {
      return "text-green-500";
    }
    if (s === "canceled" || s === "cancelled" || s === "void") {
      return "text-red-500";
    }
    return "text-yellow-500";
  };

  const codeStr = item.code ? item.code : `#${id}`;
  const dateStr = formatDateTime(item.workdate ?? item.date ?? item.createdAt);
  const clientName = item.client?.name ?? item.clientName ?? item.clientId ?? "";
  const rawStatus = item.pending ?? "";
  const statusStr = (() => {
    if (rawStatus === true || rawStatus === "pending") return "PENDING";
    if (rawStatus === false) return "COMPLETED";
    const s = String(rawStatus).toUpperCase();
    return s;
  })();

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-2 whitespace-nowrap">
        <input
          type="checkbox"
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          checked={isSelected}
          onChange={onToggleSelect}
          aria-label={`Seleccionar ${codeStr}`}
        />
      </td>

      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">
        <Link href={`/pagesInfo/deliverynotes/${id}`}>
          <span className="hover:underline">{codeStr}</span>
        </Link>
      </td>

      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">
        {dateStr || '—'}
      </td>

      <td className="px-6 py-2 whitespace-nowrap flex items-center space-x-2">
        <span className="text-sm text-gray-700">{clientName || '—'}</span>
      </td>

      <td className={`px-6 py-2 whitespace-nowrap text-sm font-medium ${getStatusClasses(rawStatus)}`}>
        {statusStr}
      </td>

      <td className="px-6 py-2 whitespace-nowrap">
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
