// components/DeliverynotesList.jsx
"use client";

import { useState, useEffect } from "react";
import DeliveryRow from "@/components/DeliveryRow";

export default function DeliverynotesList({ deliverynotes, setDeliverynotes }) {
  const [selectedIds, setSelectedIds] = useState([]);

  // Sincroniza selección si cambian los items
  useEffect(() => {
    setSelectedIds(prev =>
      prev.filter(id => deliverynotes.some(item => (item._id ?? item.id) === id))
    );
  }, [deliverynotes]);

  const allIds = deliverynotes.map(item => item._id ?? item.id);
  const isAllSelected = allIds.length > 0 && selectedIds.length === allIds.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds([...allIds]);
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(x => x !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  // Icono de flechas para header (decorativo)
  const SortIcon = () => (
    <svg
      className="inline-block w-4 h-4 ml-1 text-gray-400"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M6 8l4-4 4 4H6z" />
      <path d="M6 12l4 4 4-4H6z" />
    </svg>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-2">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                aria-label="Seleccionar todos"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {deliverynotes.map((item) => {
            const id = item._id ?? item.id;
            return (
              <DeliveryRow
                key={id}
                item={item}
                isSelected={selectedIds.includes(id)}
                onToggleSelect={() => toggleSelectOne(id)}
  
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
