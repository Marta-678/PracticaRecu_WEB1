"use client";

import { useState } from "react";
import { getFetch } from "@/utils/handlerequests";
import '@/styles/onboarding.css';

export default function Validation({ onValidation }) {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [codeInputs, setCodeInputs] = useState(["", "", "", "", "", ""]);

    // Maneja el cambio en cada input individual del código
    const handleInputChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Permitir solo números
        const newCodeInputs = [...codeInputs];
        newCodeInputs[index] = value.slice(0, 1); // Solo un carácter por input
        setCodeInputs(newCodeInputs);

        // Enfocar automáticamente el siguiente input (hasta el último índice: 5)
        if (value && index < codeInputs.length - 1) {
            const nextInput = document.getElementById(`code-input-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            setErrorMessage("No se encontró un token. Por favor, inicie sesión.");
            setSuccessMessage("");
            return;
        }

        // Combinar los inputs en un solo código
        const code = codeInputs.join("");

        // Validar manualmente antes de enviar
        if (code.length !== 6 || !/^\d+$/.test(code)) {
            setErrorMessage("El código debe tener exactamente 6 dígitos numéricos.");
            setSuccessMessage("");
            setCodeInputs(["", "", "", "", "", ""]);
            // Opcional: enfocar el primer input de nuevo
            const firstInput = document.getElementById(`code-input-0`);
            firstInput?.focus();
            return;
        }

        try {
            const data = await getFetch(
                "api/user/validation",
                { code },
                "PUT",
                {
                    Authorization: `Bearer ${token}`,
                }
            );

            setSuccessMessage("Correo verificado exitosamente.");
            setErrorMessage("");

            // Llamar a onValidation si se proporcionó
            if (typeof onValidation === "function") {
                // Puedes pasar 'data' o algún indicador a la función callback
                onValidation(data);
            }
        } catch (error) {
            setSuccessMessage("");
            setErrorMessage("Error al verificar el correo.");
            setCodeInputs(["", "", "", "", "", ""]);
            // Opcional: volver a enfocar el primer input
            const firstInput = document.getElementById(`code-input-0`);
            firstInput?.focus();
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-heading">Validar Código</h2>
            <div className="code-input-container">
                {codeInputs.map((value, index) => (
                    <input
                        key={index}
                        id={`code-input-${index}`}
                        type="text"
                        maxLength="1"
                        value={value}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className="code-input"
                    />
                ))}
            </div>
            <button onClick={handleSubmit} className="form-button">
                Validar código
            </button>

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message-code">{errorMessage}</p>}
        </div>
    );
}
