"use client";

import FormYup from "@/components/FormYup";
import { getFetch } from "@/utils/handlerequests";
import { useState } from "react";
import * as Yup from "yup";
import '@/styles/onboarding.css';

export default function Register({ onRegister, onLoginClick }) {
  // No necesitamos formData como estado externo para Formik si solo se usa en el form.
  const [formData, setFormData] = useState({firstName: "",lastName: "",email: "", password: "",});
  const initialValues = { firstName: "", lastName: "", email: "", password: "" };

  const paramForm = {
    initialValues,
    fields: [
      { name: "firstName", type: "text", label: "Nombre del Usuario" },
      { name: "lastName", type: "text", label: "Apellido del Usuario" },
      { name: "email", type: "email", label: "Correo Electrónico" },
      { name: "password", type: "password", label: "Contraseña" },
    ],
    validationSchema: Yup.object().shape({
      firstName: Yup.string()
        .trim()
        .required("El nombre es obligatorio")
        .min(2, "El nombre debe tener al menos 2 caracteres"),
      lastName: Yup.string()
        .trim()
        .required("El apellido es obligatorio")
        .min(2, "El apellido debe tener al menos 2 caracteres"),
      email: Yup.string()
        .trim()
        .required("El correo electrónico es obligatorio")
        .email("El correo electrónico no es válido"),
      password: Yup.string()
        .required("La contraseña es obligatoria")
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .matches(
          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
          "La contraseña debe contener al menos una mayúscula, un número y un carácter especial"
        ),
    }),
    handleSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        console.log("Enviando formulario de registro:", values);
        const { email, password, firstName, lastName } = values;
        // Ajusta el body según lo que tu API espera (quizá también nombre y apellido)
        const body = { email, password, firstName, lastName };
        const data = await getFetch("api/user/register", body, "POST", null);
        // getFetch ya retorna objeto JSON
        if (data && data.token) {
          localStorage.setItem("jwt", data.token);
          console.log("Usuario registrado. Token:", data.token);
          // Llamar callback al padre para navegar a validación
          onRegister(data.token);
        } else {
          // Si la API devuelve error en otro formato:
          const msg = data.message || "No se recibió token tras registro";
          console.error(msg);
          // Podrías mostrar error en algún campo o genérico:
          setFieldError("email", msg);
        }
      } catch (error) {
        console.error("Error durante registro:", error.message);
        // Mostrar error genérico o específico:
        setFieldError("email", error.message);
      } finally {
        setSubmitting(false);
      }
    },
  };

  const infoButton = {
    button1: { onclick: onLoginClick, text: "Ya tengo cuenta" },
    // No usamos onclick en el botón de submit, Formik maneja onSubmit
    button2: { text: "Regístrese con correo electrónico" },
  };

  return (
    <div className="form-container">
      <h2 className="form-heading">Registro</h2>
      <FormYup
        paramsForm={paramForm}
        formData={formData}
        setFormData={setFormData}
        linkButton={infoButton.button1}
        buttonForm={infoButton.button2}
      />
    </div>
  );
}



