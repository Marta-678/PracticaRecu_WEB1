import { useState } from "react";
import * as Yup from "yup";
import '@/styles/onboarding.css';
import { getFetch } from "@/utils/handlerequests";
import FormYup from "@/components/FormYup";

export default function LoginUser({ onRegisterClick, onLogin }) {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState(""); 

    const paramForm = {
        initialValues: { email: "", password: "" },
        fields: [
            { name: "email", type: "email", label: "Correo Electrónico" },
            { name: "password", type: "password", label: "Contraseña" },
        ],
        validationSchema: Yup.object({
            email: Yup.string().email('No es válido').required("El email es obligatorio"),
            password: Yup.string().min(8, 'Mínimo 8 caracteres').max(30, 'Máximo 30 caracteres').required("La contraseña es obligatoria"),
        }),
        handleSubmit: async (values) => {
            console.log("Formulario Enviado:", values);
            try {
                const data = await getFetch("api/user/login", values, "POST", {});

                if (data.token) {
                    localStorage.setItem("jwt", data.token);
                    console.log("Usuario autenticado. Token guardado:", data.token);

                    // Llama a la acción de inicio de sesión
                    onLogin();
                } else {
                    throw new Error("El servidor no devolvió un token");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error.message);
                setErrorMessage(error.message || "Error al iniciar sesión. Intente nuevamente.");
            }
        },
    };

    const infoButton = {
        button1: { onclick: onRegisterClick, text: "No tengo cuenta" },
        button2: { onclick: onLogin, text: "Iniciar Sesión" },
    };

    return (
        <div className="form-container">
            <h2 className="form-heading">Iniciar Sesión</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>} 
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
















// import { useState } from "react";
// import * as Yup from "yup";
// import '@/styles/onboarding.css';
// import { getFetch } from "@/utils/handlerequests";
// import FormYup from "@/components/FormYup";

// export default function LoginUser({ onRegisterClick, onLogin }) {
//     const [formData, setFormData] = useState({ email: "", password: "" });
//     const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error

//     const paramForm = {
//         initialValues: { email: "", password: "" },
//         fields: [
//             { name: "email", type: "email", label: "Correo Electrónico" },
//             { name: "password", type: "password", label: "Contraseña" },
//         ],
//         validationSchema: Yup.object({
//             email: Yup.string().email('No es válido').required("El email es obligatorio"),
//             password: Yup.string().min(8, 'Mínimo 8 caracteres').max(30, 'Máximo 30 caracteres').required("La contraseña es obligatoria"),
//         }),
//         handleSubmit: async (values) => {
//             console.log("Formulario Enviado:", values);
//             try {
//                 const data = await getFetch("api/user/login", values, "POST", {});

//                 if (data.token) {
//                     localStorage.setItem("jwt", data.token);
//                     console.log("Usuario autenticado. Token guardado:", data.token);

//                     // Llama a la acción de inicio de sesión
//                     onLogin();
//                 } else {
//                     throw new Error("El servidor no devolvió un token");
//                 }
//             } catch (error) {
//                 console.error("Error en la solicitud:", error.message);
//                 setErrorMessage(error.message || "Error al iniciar sesión. Intente nuevamente.");
//             }
//         },
//     };

//     const infoButton = {
//         button1: { onclick: onRegisterClick, text: "No tengo cuenta" },
//         button2: { onclick: onLogin, text: "Iniciar Sesión" },
//     };

//     return (
//         <div className="form-container">
//             <h2 className="form-heading">Iniciar Sesión</h2>
//             {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Muestra el error */}
//             <FormYup
//                 paramsForm={paramForm}
//                 formData={formData}
//                 setFormData={setFormData}
//                 linkButton={infoButton.button1}
//                 buttonForm={infoButton.button2}
//             />
//         </div>
//     );
// }





















// import { useState } from "react";
// import * as Yup from "yup";
// import '@/styles/onboarding.css'
// import { getFetch } from "@/utils/handlerequests";
// import FormYup from "@/components/FormYup";


// export default function LoginUser({ onRegisterClick, onLogin }){
//     const [formData, setFormData] = useState({email: "", password: "",});
//     // const data= getFetch("api/user/login", formData, "POST",null);

//     const paramForm={
//       initialValues : { email: "", password: "" },
//       fields : [
//       { name: "email", type: "email", label: "Correo Electrónico" },
//       { name: "password", type: "password", label: "Contraseña" },
//       ],

//       validationSchema : Yup.object({
//         email: Yup.string().email('no es valido').required(),
//         password: Yup.string().min(8, 'minimo 8 caracteres').max(30, 'maximo 30 caracteres').required()
//       }),

//       handleSubmit: async (values) => {
//         console.log("Formulario Enviado:", values);
//             try {
//                 // Realiza la solicitud al backend
//                 const response = await getFetch("api/user/login", values, "POST", null);

//                 // Procesa la respuesta según sea Blob o JSON
//                 const text = await response.text();
//                 const data = JSON.parse(text);

//                 if (data.token) {
//                     localStorage.setItem("jwt", data.token);
//                     console.log("Usuario autenticado. Token guardado:", data.token);

//                     // Llama a la acción de inicio de sesión
//                     onLogin();
//                 } else {
//                     throw new Error("El servidor no devolvió un token");
//                 }
//             } catch (error) {
//                 console.error("Error en la solicitud:", error.message);
//                 setErrorMessage(error.message || "Error al iniciar sesión. Intente nuevamente.");
//             }
//         },
//     }

//     const infoButton={
//       button1:{onclick:onRegisterClick,  text:"No tengo cuenta"},
//       button2:{onclick:onLogin, text:"Iniciar Sesión"},
//     }

    
    
//   return(
//     <div className="form-container">
//       <h2 className="form-heading">Iniciar Sesión</h2>
//       <FormYup
//         paramsForm={paramForm}
//         formData={formData}
//         setFormData={setFormData}
//         linkButton={infoButton.button1}
//         buttonForm={infoButton.button2}
//       ></FormYup>
//     </div>
    
//   );

// }