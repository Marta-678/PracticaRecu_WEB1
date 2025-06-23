import { getFetch } from "./handlerequests";

async function downloadPDF(deliveryNoteId) {
    try {
        const token = localStorage.getItem("jwt"); // Obtener el token del almacenamiento local
        const blob = await getFetch(`api/deliverynote/pdf/${deliveryNoteId}`, null, "GET", {
            "Authorization": `Bearer ${token}`
        });

        // Crear un enlace para descargar el archivo
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `albaran_${deliveryNoteId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("Archivo descargado correctamente");
    } catch (error) {
        console.error("Error al descargar el archivo:", error.message);
    }
}
