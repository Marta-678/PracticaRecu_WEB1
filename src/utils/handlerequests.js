import TokenService from "@/utils/TokenService";

export async function getFetch(url, body, method, headers) {
  const token = TokenService.getToken();
  if (token) {
      headers = { ...headers, Authorization: `Bearer ${token}` };
      console.log("Se añade token");
  }

  console.log("Preparando solicitud a:", `https://bildy-rpmaya.koyeb.app/${url}`);
  console.log("Headers:", headers);
  console.log("Body:", body);

  try {
      const res = await fetch(`https://bildy-rpmaya.koyeb.app/${url}`, {
          method,
          headers: {
              "Content-Type": "application/json",
              ...headers,
          },
          body: body ? JSON.stringify(body) : null,
      });

      // Verifica si la respuesta es exitosa
      if (!res.ok) {
          // Lee el cuerpo de la respuesta para el mensaje de error
          //se obtienen el contenido de la respuesta
          const contentType = res.headers.get("Content-Type");
          let errorMessage = "Error en la petición";

          if (contentType && contentType.includes("application/json")) {
              const errorResponse = await res.json();
              //imprime como adveetencia
              console.warn("Respuesta de error JSON:", errorResponse);
              errorMessage = errorResponse.message || JSON.stringify(errorResponse);
          } else {
              const errorText = await res.text(); // Si no es JSON, intenta obtener texto
              console.warn("Respuesta de error texto:", errorText);
              errorMessage = errorText;
          }

          if (res.status === 401) {
              errorMessage = "No autorizado. Verifica el token o las credenciales.";
          }

          throw new Error(errorMessage);
      }

      // Después de que la solicitud sea exitosa, se verifica el tipo de contenido de la respuest
      const contentType = res.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
          return await res.json();
      } else {
          return await res.text();
      }
  } catch (error) {
      console.error("Error en la solicitud:", error.message);
      throw error; // Relanza el error para que sea manejado por el código que llama a esta función
  }
}











// import { TokenService } from "./TokenService";

// export async function getFetch(url, body , method , headers) {
//   const token = TokenService.getToken(); // Obtén el token desde el servicio
//   if (token) {
//     headers={...headers,Authorization : `Bearer ${token}`}; // Incluye el token en las cabeceras si está disponible
//     console.log("Se añade token");
//   }

//   console.log("Preparando solicitud a:", `https://bildy-rpmaya.koyeb.app/${url}`);
//   console.log("Headers:", headers);
//   console.log("Body:", body);

//   try {
//     const res = await fetch(`https://bildy-rpmaya.koyeb.app/${url}`, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         ...headers,
//       },
//       body: body ? JSON.stringify(body) : null, // Solo incluye el body si no es nulo
//     });

//     if (!res.ok) {
//       let errorMessage = "Error en la petición";
//       try {
//         const errorResponse = await res.json();
//         console.warn("Respuesta de error:", errorResponse);
//         errorMessage = errorResponse.message || JSON.stringify(errorResponse);
//       } catch (e) {
//         console.error("Error procesando el mensaje de error:", e);
//         errorMessage = await res.text(); // Si no es JSON, intenta obtener texto plano
//       }

//       if (res.status === 401) {
//         errorMessage = "No autorizado. Verifica el token o las credenciales.";
//       }

//       throw new Error(errorMessage);
//     }

//     return await res.json(); // Retorna los datos en formato JSON
//   } catch (error) {
//     console.error("Error en la solicitud:", error);
//     throw error; // Re-lanza el error para que sea manejado por el código que llama a esta función
//   }
// }






// import { TokenService } from "./TokenService";



// export async function getFetch(url, body, method, headers) {

//   if(method!== "GET" && method!== "DELETE"){
//     const token = TokenService.getToken();
//     headers.Authorization = `Bearer ${token}`
//   }

//     const res = await fetch(`https://bildy-rpmaya.koyeb.app/${url}`,{
//         method: method,
//       headers: {
//         "Content-Type": "application/json",
//         ...headers,
//       },
//       body: body ? JSON.stringify(body) : null
//       ,
//     });

//     if (!res.ok) {
//       let errorMessage = "Error en la petición";
//       try {
//           const errorBlob = await res.blob();
//           const errorText = await errorBlob.text(); // Convertir el Blob a texto
//           const errorJson = JSON.parse(errorText); // Convertir el texto a JSON
//           errorMessage = errorJson.message || errorMessage;
//       } catch (e) {
//           console.error("No se pudo procesar el mensaje de error desde el Blob:", e);
//       }
//       throw new Error(errorMessage);
//   }

//   // Retornar directamente el Blob si es exitoso
//   return await res.blob();
//   }


