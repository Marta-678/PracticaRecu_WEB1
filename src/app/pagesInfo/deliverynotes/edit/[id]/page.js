"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Cambiar en caso de router alternativo
import { getFetch } from "@/utils/handlerequests";
import FormYup from "@/components/FormYup";
import * as Yup from "yup";

export default function EditDeliverynote() {
  const router = useRouter();
  const { id } = useParams(); 
  const [formData, setFormData] = useState(null); // Datos del deliverynotee
  const [loading, setLoading] = useState(true);

  const [clientOptions, setClientOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);


  const fetchClientOptions = async () => {
    try {
      const data = await getFetch("api/client", null, "GET", {});
      const options = data.map(client => ({
        value: client._id, 
        label: client.name
      }));
      setClientOptions(options);
    } catch (err) {
      console.error("Error al obtener los clientes:", err.message || err);
      setClientOptions([]); 
    }
  };

  const fetchProjectOptions = async () => {
    try {
      const data = await getFetch(`api/project?clientId=${clientId}`, null, "GET", {});
      const options = data.map(project => ({
        value: project._id, 
        label: project.name
      }));
      setProjectOptions(options);
    } catch (err) {
      console.error("Error al obtener los clientes:", err.message || err);
      setProjectOptions([]); // En caso de error, dejamos el array vacío
    }
  };


  useEffect(() => {
    async function fetchDeliverynote() {
      try {
        const data = await getFetch(`api/deliverynote/${id}`, null, "GET", {});
        setFormData(data);
      } catch (err) {
        console.error("Error al obtener el deliverynotee:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDeliverynote();
    fetchProjectOptions();
    fetchClientOptions();
  }, [id]);

  const paramForm = {
    initialValues: formData || {},

    fields: [
        { name: "clientId", type: "select", label: "ID del Cliente", options: clientOptions},
        { name: "projectId", type: "select", label: "ID del Proyecto", options: projectOptions },
        { name: "format", 
            type: "select", 
            label: "Formato", 
            options: [
                { value: "material", label: "Material" },
                { value: "hours", label: "Horas" }
            ] 
        },
        { name: "material", type: "text", label: "Tipo de Material" },
        { name: "hours", type: "number", label: "Horas" },
        { name: "description", type: "textarea", label: "Descripción" },
        { name: "workdate", type: "date", label: "Fecha de Trabajo" },

    ],  

    validationSchema: Yup.object({
      name: Yup.string().min(3, "Mínimo 3 caracteres").max(50, "Máximo 50 caracteres").required(),
      email: Yup.string().email("Correo electrónico inválido").required(),
      phone: Yup.string().required(),
      address: Yup.string().required(),
    }),

    handleSubmit: async (values) => {
      try {
        const response = await getFetch(`api/deliverynote/${id}`, values, "PUT", {});
        alert("deliverynote actualizado con éxito.");
        router.push("/pagesInfo/deliverynotes"); 
      } catch (error) {
        console.error("Error al actualizar deliverynotee:", error.message);
      }
    },
  };

  if (loading) return <p>Cargando...</p>;
  if (!formData) return <p>Error al cargar los datos del deliverynotee.</p>;

  return (
    <div>
      <h2>Editar deliverynotee</h2>
      <FormYup
        paramsForm={paramForm}
        formData={formData}
        setFormData={setFormData}
        buttonForm={{ text: "Guardar cambios" }}
      />
    </div>
  );
}
