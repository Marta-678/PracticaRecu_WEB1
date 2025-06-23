"use client";

import { useState, useEffect } from "react";
import FormYup from "@/components/FormYup";
import { getFetch } from "@/utils/handlerequests";
import * as Yup from "yup";
import '@/styles/onboarding.css'; // o la que uses para estilos de formulario

export default function CreateDeliveryNotes() {
  // Estado plano para FormYup
  const [formData, setFormData] = useState({
    clientId: "",
    projectId: "",
    format: "",      // "material" o "hours"
    material: "",    // sólo si format === "material"
    hours: "",       // sólo si format === "hours"
    description: "",
    workdate: ""     // tipo "YYYY-MM-DD"
  });

  // Opciones para select
  const [clientOptions, setClientOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);

  // Fetch de clientes
  const fetchClientOptions = async () => {
    try {
      const data = await getFetch("api/client", null, "GET", {});
      const opciones = data.map(client => ({
        value: client._id,
        label: client.name
      }));
      setClientOptions([
        { value: "", label: "Seleccione un cliente" },
        ...opciones
      ]);
    } catch (err) {
      console.error("Error al obtener clientes:", err.message || err);
      setClientOptions([{ value: "", label: "Seleccione un cliente", selected: true }]);
    }
  };

  // Fetch de proyectos de un cliente dado (opcional, si quieres filtrar)
  const fetchProjectOptions = async (clientId) => {
    if (!clientId) {
      setProjectOptions([{ value: "", label: "Seleccione proyecto"}]);
      return;
    }
    try {
      
      const data = await getFetch(`api/project?clientId=${clientId}`, null, "GET", {});
      const opciones = data.map(proj => ({
        value: proj._id,
        label: proj.name
      }));
      setProjectOptions([
        { value: "", label: "Seleccione un proyecto", selected: true },
        ...opciones
      ]);
    } catch (err) {
      console.error("Error al obtener proyectos:", err.message || err);
      setProjectOptions([{ value: "", label: "Seleccione un proyecto", selected: true }]);
    }
  };

  useEffect(() => {
    fetchClientOptions();
  }, []);

  // Cuando cambia clientId en formData, recargar proyectos
  useEffect(() => {
    fetchProjectOptions(formData.clientId);
    // También limpiar projectId si client cambia
    setFormData(prev => ({
      ...prev,
      projectId: ""
    }));
  }, [formData.clientId]);

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    clientId: Yup.string()
      .required("El ID del cliente es obligatorio"),
    projectId: Yup.string()
      .required("El ID del proyecto es obligatorio"),
    format: Yup.string()
      .required("El formato es obligatorio"),
    material: Yup.string()
      .min(1, "Debe especificar el tipo de material")
      .required("El material es obligatorio"),
    hours: Yup.number()
      .typeError("Debe ser un número")
      .positive("Debe ser un número positivo")
      .integer("Debe ser un número entero")
      .required("Las horas son obligatorias"),
    description: Yup.string()
      .min(3, "Mínimo 3 caracteres")
      .max(200, "Máximo 200 caracteres")
      .required("La descripción es obligatoria"),
    workdate: Yup.date()
      .typeError("Fecha inválida")
      .required("La fecha de trabajo es obligatoria")
  });

  // Configuramos paramsForm para FormYup
  const paramForm = {
    initialValues: formData,
    validationSchema,
    handleSubmit: async (values ) => {

      const payload = {
        clientId: values.clientId,
        projectId: values.projectId,
        format: values.format,
        material: values.material,
        hours: Number(values.hours),
        description: values.description,
        workdate: values.workdate
      };
      try {
        console.log("Payload a enviar DeliveryNotes:", payload);
        const data = await getFetch("api/deliverynote", payload, "POST", {});
        console.log("Delivery note creada exitosamente:", data);
        const ok= console.log("Registro exitoso:", data);
        if (ok) {
          router.back();
        }
        // Limpiar formData tras éxito:
        setFormData({
          clientId: "",
          projectId: "",
          format: "",
          material: "",
          hours: "",
          description: "",
          workdate: ""
        });
      } catch (error) {
        console.error("Error al crear delivery note:", error.message || error);
        alert("Hubo un error al crear la delivery note. Revisa la consola.");
      }
    },
    // Campos dinámicos según formData.format
    fields: [
      { name: "clientId", type: "select", label: "Cliente", options: clientOptions },
      { name: "projectId", type: "select", label: "Proyecto", options: projectOptions },
      {
        name: "format",
        type: "select",
        label: "Formato",
        options: [
          { value: "", label: "Seleccione un formato" },
          { value: "material", label: "Material" },
          { value: "hours", label: "Horas" }
        ]
      },
      { name: "material", type: "text", label: "Tipo de Material" },
      { name: "hours", type: "number", label: "Horas" },
      { name: "description", type: "text", label: "Descripción" },
      { name: "workdate", type: "date", label: "Fecha de trabajo" }
    ],
    buttonForm: { text: "Crear Delivery Note" }
  };

  return (
    <div className="form-container">
      <h2>Crear Delivery Note</h2>
      <FormYup
        paramsForm={paramForm}
        formData={formData}
        setFormData={setFormData}
        buttonForm={{ text: "Crear Delivery Note" }}
      />
    </div>
  );
}

