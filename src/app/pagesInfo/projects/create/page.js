"use client";

import FormYup from "@/components/FormYup";
import { useRouter } from "next/navigation";
import { getFetch } from "@/utils/handlerequests";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import '@/styles/onboarding.css';

export default function CreateProject() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    projectCode: "",
    email: "",
    "address.street": "",
    "address.number": "",
    "address.postal": "",
    "address.city": "",
    "address.province": "",
    code: "",
    clientId: ""
  });

  const [clientOptions, setClientOptions] = useState([]);

  const fetchClientOptions = async () => {
    try {
      const data = await getFetch("api/client", null, "GET", {});
      const opciones = data.map(client => ({
        value: client._id,
        label: client.name
      }));
      const withPlaceholder = [
        { value: "", label: "Seleccione un cliente", selected: true },
        ...opciones
      ];
      setClientOptions(withPlaceholder);
    } catch (err) {
      console.error("Error al obtener los clientes:", err.message || err);
      setClientOptions([{ value: "", label: "Seleccione un cliente", selected: true }]);
    }
  };

  useEffect(() => {
    fetchClientOptions();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Mínimo 3 caracteres")
      .max(50, "Máximo 50 caracteres")
      .required("El nombre del proyecto es obligatorio"),
    projectCode: Yup.string()
      .min(3, "Mínimo 3 caracteres")
      .max(20, "Máximo 20 caracteres")
      .required("El código del proyecto es obligatorio"),
    email: Yup.string()
      .email("Correo electrónico inválido")
      .required("El correo electrónico es obligatorio"),
    "address.street": Yup.string()
      .min(3, "Mínimo 3 caracteres")
      .max(50, "Máximo 50 caracteres")
      .required("La calle es obligatoria"),
    "address.number": Yup.number()
      .typeError("Debe ser un número")
      .positive("Debe ser un número positivo")
      .integer("Debe ser un número entero")
      .required("El número es obligatorio"),
    "address.postal": Yup.number()
      .typeError("Debe ser un número")
      .positive("Debe ser un número positivo")
      .integer("Debe ser un número entero")
      .min(1000, "Debe tener al menos 4 dígitos")
      .max(99999, "Debe tener como máximo 5 dígitos")
      .required("El código postal es obligatorio"),
    "address.city": Yup.string()
      .min(2, "Mínimo 2 caracteres")
      .max(50, "Máximo 50 caracteres")
      .required("La ciudad es obligatoria"),
    "address.province": Yup.string()
      .min(2, "Mínimo 2 caracteres")
      .max(50, "Máximo 50 caracteres")
      .required("La provincia es obligatoria"),
    code: Yup.string()
      .min(3, "Mínimo 3 caracteres")
      .max(20, "Máximo 20 caracteres")
      .required("El código es obligatorio"),
    clientId: Yup.string()
      .required("El ID del cliente es obligatorio")
  });

  const paramForm = {
    initialValues: formData,
    validationSchema,
    handleSubmit: async (values) => {
      console.log("Formulario Enviado:", values);
      const payload = {
        name: values.name,
        projectCode: values.projectCode,
        email: values.email,
        address: {
          street: values["address.street"],
          number: values["address.number"],
          postal: values["address.postal"],
          city: values["address.city"],
          province: values["address.province"]
        },
        code: values.code,
        clientId: values.clientId
      };
      try {
        console.log("Payload a enviar:", payload);
        const data = await getFetch("api/project", payload, "POST", {});
        const ok= console.log("Registro exitoso:", data);
        if (ok) {
          router.back();
        }
        confirm("Proyecto creado exitosamente");
        setFormData({
          name: "",
          projectCode: "",
          email: "",
          "address.street": "",
          "address.number": "",
          "address.postal": "",
          "address.city": "",
          "address.province": "",
          code: "",
          clientId: ""
        });
      } catch (error) {
        console.error("Error en el registro:", error.message);
      }
    },
    fields: [
      { name: "name", type: "text", label: "Nombre del Proyecto" },
      { name: "projectCode", type: "text", label: "Código del Proyecto" },
      { name: "email", type: "email", label: "Correo Electrónico" },
      { name: "address.street", type: "text", label: "Calle" },
      { name: "address.number", type: "number", label: "Número" },
      { name: "address.postal", type: "number", label: "Código Postal" },
      { name: "address.city", type: "text", label: "Ciudad" },
      { name: "address.province", type: "text", label: "Provincia" },
      { name: "code", type: "text", label: "Código" },
      { name: "clientId", type: "select", label: "ID del Cliente", options: clientOptions }
    ],
    buttonForm: { text: "Crear Proyecto" }
  };

  return (
    <div className="form-container">
      <h2>Crear Proyecto</h2>
      <FormYup
        key={JSON.stringify(formData)}
        paramsForm={paramForm}
        formData={formData}
        setFormData={setFormData}
        buttonForm={{ text: "Crear Proyecto" }}
      />
    </div>
  );
}
