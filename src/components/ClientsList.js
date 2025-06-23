import React from "react";
import Link from "next/link";
import { getFetch } from "@/utils/handlerequests";

const ClientList = ({ clients }) => {
  async function handleDelete(id) {
    const confirmDelete = confirm(
      `¿Estás seguro de que deseas eliminar el cliente con ID: ${id}?`
    );
    if (confirmDelete) {
      try {
        const data = await getFetch(`api/client/${id}`, null, "DELETE", {});
        window.location.reload();
      } catch (error) {
        console.error("Error al eliminar cliente:", error.message);
        throw error;
      }
    }
  }

  return (
    <div className="clients-table-wrapper">
      <ul className="clients-table">
        {clients.map((client) => (
          <li
            key={client._id}
            className="client-row"
          >
            <Link href={`/pagesInfo/clients/${client._id}`} legacyBehavior>
              <a className="client-link">
                {client.name}
              </a>
            </Link>
            <div
              className="client-actions"
              onClick={(e) => e.stopPropagation()} 
            >
              <Link href={`/pagesInfo/clients/edit/${client._id}`}>
                <span className="edit-button">✏️</span>
              </Link>
              <span
                className="delete-button"
                onClick={() => handleDelete(client._id)}
              >
                🗑️
              </span>
            </div>
          </li>
        ))}
      </ul>
      <Link href={`/pagesInfo/clients/create`}>
        <span className="cta-button">Crear Nuevo Cliente</span>
      </Link>
    </div>
  );
};

export default ClientList;
