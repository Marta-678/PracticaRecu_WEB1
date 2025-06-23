"use client";

import DeliverynotesList from "@/components/DeliverynotesList";
import { useEffect, useState } from "react";
import { getFetch } from "@/utils/handlerequests";
import Link from "next/link";

export default function Deliverynotes({ token }) {
    const [deliverynotes, setDeliverynotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        async function fetchdeliverynotes() {
          try {
            const data = await getFetch("api/deliverynote", null, "GET", {});
            setDeliverynotes(data || []);
          } catch (err) {
            setError(err.message || "Error al obtener los clientes.");
          } finally {
            setLoading(false);
          }
        }
    
        fetchdeliverynotes();
      }, []);

      
    
      if (loading) return <p>Cargando...</p>;
    
      return (
        <div>
          {error && <p className="error">{error}</p>}
    
          {Array.isArray(deliverynotes) && deliverynotes.length === 0 ? (
            <div className="no-deliverynotes">
              <h2>Crea tu primer Cliente</h2>
              <p>Para poder generar Albaranes digitales</p>
              <Link href="/pagesInfo/deliverynotes/create">
                <button className="">¡Sí, vamos!</button>
              </Link>
            </div>
          ) : (
            <DeliverynotesList deliverynotes={deliverynotes} setDeliverynotes={setDeliverynotes} />
          )}
        </div>
      );
    }
    
    
    
    