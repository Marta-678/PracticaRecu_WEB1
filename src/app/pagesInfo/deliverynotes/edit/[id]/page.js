"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFetch } from "@/utils/handlerequests";

export default function EditDeliverynote() {
  const { id } = useParams();
  const router = useRouter();

  // Estados de carga y error para el deliverynote
  const [loadingDeliverynote, setLoadingDeliverynote] = useState(true);
  const [errorDeliverynote, setErrorDeliverynote] = useState(null);
  // Datos originales para comparación si se desea
  const [originalDeliverynote, setOriginalDeliverynote] = useState(null);

  // Estado del formulario: inicializamos con campos vacíos; luego se sobrescribe con los datos recibidos
  const [formData, setFormData] = useState({
    clientId: "",
    projectId: "",
    format: "",
    material: "",
    hours: "",
    description: "",
    workdate: "",
  });

  // Opciones para selects
  const [clientOptions, setClientOptions] = useState([]);
  const [errorClients, setErrorClients] = useState(null);
  const [loadingClients, setLoadingClients] = useState(false);

  const [projectOptions, setProjectOptions] = useState([]);
  const [errorProjects, setErrorProjects] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Estado de envío
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Función para ir atrás: si hay historial, back, sino ir a listado
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/pagesInfo/deliverynotes");
    }
  };

  // Fetch de clientes para el select
  const fetchClientOptions = async () => {
    setLoadingClients(true);
    setErrorClients(null);
    try {
      const data = await getFetch("api/client", null, "GET", {});
      if (Array.isArray(data)) {
        const options = data.map((client) => ({
          value: client._id,
          label: client.name,
        }));
        setClientOptions(options);
      } else {
        setClientOptions([]);
      }
    } catch (err) {
      console.error("Error al obtener los clientes:", err);
      setErrorClients(err.message || "Error al obtener los clientes.");
      setClientOptions([]);
    } finally {
      setLoadingClients(false);
    }
  };

  // Fetch de proyectos según clientId para el select
  const fetchProjectOptions = async (clientId) => {
    if (!clientId) {
      setProjectOptions([]);
      return;
    }
    setLoadingProjects(true);
    setErrorProjects(null);
    try {
      const data = await getFetch(`api/project?clientId=${clientId}`, null, "GET", {});
      if (Array.isArray(data)) {
        const options = data.map((project) => ({
          value: project._id,
          label: project.name,
        }));
        setProjectOptions(options);
      } else {
        setProjectOptions([]);
      }
    } catch (err) {
      console.error("Error al obtener los proyectos:", err);
      setErrorProjects(err.message || "Error al obtener los proyectos.");
      setProjectOptions([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Al montar o cambiar id: fetch del deliverynote, y fetch de clientes
  useEffect(() => {
    if (!id) {
      setErrorDeliverynote("ID de deliverynote no proporcionado.");
      setLoadingDeliverynote(false);
      return;
    }
    const fetchDeliverynote = async () => {
      setLoadingDeliverynote(true);
      setErrorDeliverynote(null);
      try {
        const data = await getFetch(`api/deliverynote/${id}`, null, "GET", {});
        if (!data) {
          setErrorDeliverynote("No se encontraron detalles para el deliverynote.");
          setOriginalDeliverynote(null);
        } else {
          setOriginalDeliverynote(data);
          // Inicializar formData con los valores recibidos, cuidando existencia de campos
          setFormData({
            clientId: data.clientId || "",
            projectId: data.projectId || "",
            format: data.format || "",
            material: data.material || "",
            hours: data.hours ?? "",
            description: data.description || "",
            workdate: data.workdate ? data.workdate.slice(0, 10) : "", // Asumiendo ISO string, tomando YYYY-MM-DD
          });
          // Tras obtener el deliverynote con clientId, cargar proyectos de ese cliente
          if (data.clientId) {
            fetchProjectOptions(data.clientId);
          }
        }
      } catch (err) {
        console.error("Error al obtener el deliverynote:", err);
        setErrorDeliverynote(err.message || "Error al obtener el deliverynote.");
        setOriginalDeliverynote(null);
      } finally {
        setLoadingDeliverynote(false);
      }
    };
    fetchDeliverynote();
    // Cargar opciones de clientes
    fetchClientOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Cuando cambie formData.clientId (por selección del usuario), recargar proyectos
  useEffect(() => {
    // Si no coincide con el original, o en general cuando cambie:
    fetchProjectOptions(formData.clientId);
  }, [formData.clientId]);

  // Manejo de cambios en inputs/selects
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Nota: si cambias clientId, el useEffect disparará fetchProjectOptions
    // y podrías resetear projectId si quieres:
    if (name === "clientId") {
      setFormData((prev) => ({
        ...prev,
        clientId: value,
        projectId: "", // resetear proyecto al cambiar cliente
      }));
    }
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    // Validaciones básicas de campos requeridos (puedes ampliar según necesites)
    if (!formData.clientId) {
      setSubmitError("Seleccione un cliente.");
      setSubmitting(false);
      return;
    }
    if (!formData.projectId) {
      setSubmitError("Seleccione un proyecto.");
      setSubmitting(false);
      return;
    }
    if (!formData.format) {
      setSubmitError("Seleccione un formato.");
      setSubmitting(false);
      return;
    }
    // Más validaciones (e.g., horas numéricas si format==='hours', etc.) se pueden añadir aquí

    try {
      const payload = {
        clientId: formData.clientId,
        projectId: formData.projectId,
        format: formData.format,
        material: formData.material,
        hours: formData.hours,
        description: formData.description,
        workdate: formData.workdate, // formato 'YYYY-MM-DD'
      };
      await getFetch(`api/deliverynote/${id}`, payload, "PUT", {
        "Content-Type": "application/json",
      });
      // Tras actualizar, volvemos a la lista
      router.push("/pagesInfo/deliverynotes");
    } catch (err) {
      console.error("Error al actualizar deliverynote:", err);
      setSubmitError(err.message || "Error al actualizar deliverynote.");
    } finally {
      setSubmitting(false);
    }
  };

  // Renderizado
  if (loadingDeliverynote) {
    return (
      <div className="loading-text">
        Cargando datos del deliverynote para edición...
      </div>
    );
  }
  if (errorDeliverynote) {
    return (
      <div>
        <p className="error-text">Error: {errorDeliverynote}</p>
        <button onClick={handleBack} className="error-back-button">
          ← Volver
        </button>
      </div>
    );
  }
  if (!originalDeliverynote) {
    return (
      <div>
        <p>No hay datos de deliverynote para editar.</p>
        <button onClick={handleBack} className="back-button">
          ← Volver
        </button>
      </div>
    );
  }

  return (
    <div className="edit-container">
      <button onClick={handleBack} className="back-button">
        ← Volver
      </button>

      <div className="detail-header">
        <h1>Editar Delivery Note</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Cliente */}
        <div className="detail-field" style={{ marginBottom: "12px" }}>
          <label htmlFor="clientId" style={{ display: "block", marginBottom: "4px" }}>
            Cliente:
          </label>
          {loadingClients ? (
            <p>Cargando clientes...</p>
          ) : errorClients ? (
            <p className="error-text">Error cargando clientes: {errorClients}</p>
          ) : (
            <select
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="">-- Seleccione un cliente --</option>
              {clientOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Proyecto */}
        <div className="detail-field" style={{ marginBottom: "12px" }}>
          <label htmlFor="projectId" style={{ display: "block", marginBottom: "4px" }}>
            Proyecto:
          </label>
          {loadingProjects ? (
            <p>Cargando proyectos...</p>
          ) : errorProjects ? (
            <p className="error-text">Error cargando proyectos: {errorProjects}</p>
          ) : (
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              required
              disabled={!formData.clientId}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="">-- Seleccione un proyecto --</option>
              {projectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Formato */}
        <div className="detail-field" style={{ marginBottom: "12px" }}>
          <label htmlFor="format" style={{ display: "block", marginBottom: "4px" }}>
            Formato:
          </label>
          <select
            id="format"
            name="format"
            value={formData.format}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">-- Seleccione formato --</option>
            <option value="material">Material</option>
            <option value="hours">Horas</option>
          </select>
        </div>

        {/* Tipo de Material */}
        <div className="detail-field" style={{ marginBottom: "12px" }}>
          <label htmlFor="material" style={{ display: "block", marginBottom: "4px" }}>
            Tipo de Material:
          </label>
          <input
            type="text"
            id="material"
            name="material"
            value={formData.material}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        {/* Horas */}
        <div className="detail-field" style={{ marginBottom: "12px" }}>
          <label htmlFor="hours" style={{ display: "block", marginBottom: "4px" }}>
            Horas:
          </label>
          <input
            type="number"
            id="hours"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        {/* Descripción */}
        <div className="detail-field" style={{ marginBottom: "12px" }}>
          <label htmlFor="description" style={{ display: "block", marginBottom: "4px" }}>
            Descripción:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        {/* Fecha de Trabajo */}
        <div className="detail-field" style={{ marginBottom: "12px" }}>
          <label htmlFor="workdate" style={{ display: "block", marginBottom: "4px" }}>
            Fecha de Trabajo:
          </label>
          <input
            type="date"
            id="workdate"
            name="workdate"
            value={formData.workdate}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        {submitError && (
          <p className="error-text" style={{ marginBottom: "12px" }}>
            Error al guardar: {submitError}
          </p>
        )}

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={handleBack}
            disabled={submitting}
            className="edit-button"
          >
            Cancelar
          </button>
          <button type="submit" disabled={submitting} className="primary-button">
            {submitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}






// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation"; // Cambiar en caso de router alternativo
// import { getFetch } from "@/utils/handlerequests";
// import FormYup from "@/components/FormYup";
// import * as Yup from "yup";

// export default function EditDeliverynote() {
//   const router = useRouter();
//   const { id } = useParams(); 
//   const [formData, setFormData] = useState(null); // Datos del deliverynotee
//   const [loading, setLoading] = useState(true);

//   const [clientOptions, setClientOptions] = useState([]);
//   const [projectOptions, setProjectOptions] = useState([]);


//   const fetchClientOptions = async () => {
//     try {
//       const data = await getFetch("api/client", null, "GET", {});
//       const options = data.map(client => ({
//         value: client._id, 
//         label: client.name
//       }));
//       setClientOptions(options);
//     } catch (err) {
//       console.error("Error al obtener los clientes:", err.message || err);
//       setClientOptions([]); 
//     }
//   };

//   const fetchProjectOptions = async () => {
//     try {
//       const data = await getFetch(`api/project?clientId=${clientId}`, null, "GET", {});
//       const options = data.map(project => ({
//         value: project._id, 
//         label: project.name
//       }));
//       setProjectOptions(options);
//     } catch (err) {
//       console.error("Error al obtener los clientes:", err.message || err);
//       setProjectOptions([]); // En caso de error, dejamos el array vacío
//     }
//   };


//   useEffect(() => {
//     async function fetchDeliverynote() {
//       try {
//         const data = await getFetch(`api/deliverynote/${id}`, null, "GET", {});
//         setFormData(data);
//       } catch (err) {
//         console.error("Error al obtener el deliverynotee:", err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchDeliverynote();
//     fetchProjectOptions();
//     fetchClientOptions();
//   }, [id]);

//   const paramForm = {
//     initialValues: formData || {},

//     fields: [
//         { name: "clientId", type: "select", label: "ID del Cliente", options: clientOptions},
//         { name: "projectId", type: "select", label: "ID del Proyecto", options: projectOptions },
//         { name: "format", 
//             type: "select", 
//             label: "Formato", 
//             options: [
//                 { value: "material", label: "Material" },
//                 { value: "hours", label: "Horas" }
//             ] 
//         },
//         { name: "material", type: "text", label: "Tipo de Material" },
//         { name: "hours", type: "number", label: "Horas" },
//         { name: "description", type: "textarea", label: "Descripción" },
//         { name: "workdate", type: "date", label: "Fecha de Trabajo" },

//     ],  

//     validationSchema: Yup.object({
//       name: Yup.string().min(3, "Mínimo 3 caracteres").max(50, "Máximo 50 caracteres").required(),
//       email: Yup.string().email("Correo electrónico inválido").required(),
//       phone: Yup.string().required(),
//       address: Yup.string().required(),
//     }),

//     handleSubmit: async (values) => {
//       try {
//         const response = await getFetch(`api/deliverynote/${id}`, values, "PUT",{
//         'Content-Type': 'application/json'
//       });
//         alert("deliverynote actualizado con éxito.");
//         router.push("/pagesInfo/deliverynotes"); 
//       } catch (error) {
//         console.error("Error al actualizar deliverynotee:", error.message);
//       }
//     },
//   };

//   if (loading) return <p>Cargando...</p>;
//   if (!formData) return <p>Error al cargar los datos del deliverynotee.</p>;

//   return (
//     <div>
//       <h2>Editar deliverynotee</h2>
//       <FormYup
//         paramsForm={paramForm}
//         formData={formData}
//         setFormData={setFormData}
//         buttonForm={{ text: "Guardar cambios" }}
//       />
//     </div>
//   );
// }
