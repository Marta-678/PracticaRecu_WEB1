"use client";

import FormYup from "@/components/FormYup";
import { getFetch } from "@/utils/handlerequests";
import { useEffect, useState } from 'react';
import * as Yup from "yup";
import "@/styles/onboarding.css";

import Link from "next/link"; // Importar Link

export default function CreateClient() {
  const [formData, setFormData] = useState({
    name: "",
    cif: "",
    email: "",
    phone: 0,
    address: {
      street: "",
      number: 0,
      postal: 0,
      city: "",
      province: "",
    },
  });

  const [isClientCreated, setIsClientCreated] = useState(false); 



  const paramForm = {
    initialValues: { ...formData },

    fields: [
      { name: "name", type: "text", label: "Nombre del Cliente" },
      { name: "cif", type: "text", label: "CIF" },
      { name: "email", type: "email", label: "Correo Electrónico" },
      { name: "phone", type: "number", label: "Teléfono" },
      { name: "address.street", type: "text", label: "Calle" },
      { name: "address.number", type: "number", label: "Número" },
      { name: "address.postal", type: "number", label: "Código Postal" },
      { name: "address.city", type: "text", label: "Ciudad" },
      { name: "address.province", type: "text", label: "Provincia" },
    ],

    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Mínimo 3 caracteres")
        .max(50, "Máximo 50 caracteres")
        .required(),
      cif: Yup.string().matches(/^[A-Z0-9]{9}$/, "CIF inválido").required(),
      email: Yup.string().email("Correo electrónico inválido").required(),
      phone: Yup.string().matches(/^\d{9}$/, "Teléfono inválido").required(),
      address: Yup.object({
        street: Yup.string().required(),
        number: Yup.number().required(),
        postal: Yup.number().required(),
        city: Yup.string().required(),
        province: Yup.string().required(),
      }),
    }),

    handleSubmit: async (values) => {
      try {
        console.log("Formulario Enviado:", values);

        const { email, phone, ...filteredValues } = values;

        // Llamar al API para registrar el cliente
        const data = await getFetch("api/client", filteredValues, "POST", {});
        console.log("Registro exitoso:", data);

        // Después de crear el cliente, cambiamos el estado para mostrar el Link
        setIsClientCreated(true);
        //si se confirma se asocia a un proyecto
        const ok= console.log("Registro exitoso:", data);
        if (ok) {
          router.back();
        }

      } catch (error) {
        console.error("Error en el registro:", error.message);
      }
    },
  };

  return (
    <div className="form-container">
      <h2>Crear Cliente</h2>
      <FormYup
        paramsForm={paramForm}
        formData={formData}
        setFormData={setFormData}
        buttonForm={{ text: "Crear cliente" }}
      />
    </div>
  );
}

