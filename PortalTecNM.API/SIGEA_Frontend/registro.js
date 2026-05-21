document.getElementById("formRegistro").addEventListener("submit", async function(e) {
    e.preventDefault(); // Evita que la página se recargue

    // 1. Sacamos los datos de las cajitas de texto
    const nuevaMatricula = document.getElementById("matricula").value;
    const nuevaPassword = document.getElementById("password").value;

    // 2. Preparamos el paquete de datos (Asegúrate de que los nombres coincidan con lo que pide tu C#)
    const datosUsuario = {
        matricula: nuevaMatricula,
        password: nuevaPassword,
        rol: "Admin" // O "Alumno", dependiendo de lo que quieras crear
    };

    try {
        // 3. Enviamos la petición POST a tu API en la nube
        // OJO: Cambia "/Auth/registrar" por la ruta exacta de tu endpoint en C#
        const respuesta = await fetch(`${API_URL}/Auth/registrar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosUsuario)
        });

        if (respuesta.ok) {
            alert("¡Usuario creado exitosamente en la nube!");
            window.location.href = "index.html"; // Lo mandamos de regreso al login
        } else {
            alert("Error al crear el usuario. Revisa los datos.");
        }
    } catch (error) {
        console.error("Hubo un error de conexión:", error);
    }
});