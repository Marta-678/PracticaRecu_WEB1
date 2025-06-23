'use client';

import { Formik, Form, Field, ErrorMessage } from "formik";
import "@/styles/formyup.css";

export default function FormYup({ paramsForm, formData, setFormData, buttonForm, linkButton }) {
  return (
    <Formik
    // establece los valores
      initialValues={paramsForm.initialValues}
      // recibe los valores del formulario , setSubmitting anula el activo del boton
      onSubmit={(values, { setSubmitting }) => {
        paramsForm.handleSubmit(values, setSubmitting);
      }}
      //esquema de validación
      validationSchema={paramsForm.validationSchema}
    >
      {/* handleChange para manejar cambios  */}
      {({ isSubmitting, handleChange }) => (
        <Form className="form-wrapper">
          {paramsForm.fields.map(({ name, type, label, options }) => (
            <div key={name} className="form-field">
              <label htmlFor={name} className="form-label">
                {label}
              </label>
              {type === "select" ? (
                <select
                  name={name}
                  className="form-input"
                  value={formData[name] || ""}
                  onChange={(e) => {
                    // cambio en el campo del formulario 
                    console.log("onChange:", name, "handleChange:", handleChange, "typeof handleChange:", typeof handleChange);
                    handleChange(e);
                    setFormData({ ...formData, [name]: e.target.value });
                  }}
                >
                  {options.map(({ value, label, selected }) => (
                    <option key={value} value={value} selected={selected}>
                      {label}
                    </option>
                  ))}
                </select>
      

              ) : (
                <Field
                  name={name}
                  type={type}
                  className="form-input"
                  value={formData[name] || ""}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData({ ...formData, [name]: e.target.value });
                  }}
                />
              )}
              <ErrorMessage name={name} component="div" className="form-error" />
            </div>
          ))}

          {linkButton && (
            <button
              onClick={linkButton.onclick || (() => {})}
              className="form-link"
            >
              {linkButton.text || ""}
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="form-button"
          >
            {buttonForm?.text || ""}
          </button>
        </Form>
      )}
    </Formik>
  );
}















