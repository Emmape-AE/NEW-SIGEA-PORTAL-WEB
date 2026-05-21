document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Guardia de Seguridad (Proteger la ruta)
    const token = localStorage.getItem("jwt_token");
    const rol = localStorage.getItem("user_role");

    if (!token || rol !== "Admin") {
        // Si no tiene token, o su rol NO es Admin, lo sacamos de aquí
        alert("Acceso denegado. Área exclusiva para Administradores.");
        window.location.href = "index.html"; 
        return; 
    }

    // 2. Cerrar Sesión del Admin
    const btnAdminLogout = document.getElementById("btnAdminLogout");
    
    btnAdminLogout.addEventListener("click", () => {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user_role");
        window.location.href = "index.html"; // Lo regresamos al login
    });

    // --- REFERENCIAS A LAS VISTAS Y BOTONES ---
    const dashboardAdminView = document.getElementById("dashboardAdminView");
    const alumnosAdminView = document.getElementById("alumnosAdminView");
    const btnGestionAlumnos = document.getElementById("btnGestionAlumnos");
    const btnVolverDashboard = document.getElementById("btnVolverDashboard");
    
    // Configuración
    const API_URL = "http://localhost:5289/api";

    // --- NAVEGACIÓN ---
    btnGestionAlumnos.addEventListener("click", () => {
        dashboardAdminView.style.display = "none";
        alumnosAdminView.style.display = "block";
        cargarDirectorioAlumnos(); // Descargamos los datos
    });

    btnVolverDashboard.addEventListener("click", () => {
        alumnosAdminView.style.display = "none";
        dashboardAdminView.style.display = "flex"; // Regresa al grid
    });

    // --- FUNCIÓN PARA CARGAR ALUMNOS ---
    async function cargarDirectorioAlumnos() {
        const tbody = document.getElementById("tablaAdminAlumnos");
        tbody.innerHTML = `<tr><td colspan="5" class="text-center p-4"><div class="spinner-border text-primary btn-sm" role="status"></div> Cargando...</td></tr>`;

        try {
            const response = await fetch(`${API_URL}/Alumnos`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` } // Usamos el gafete del Admin
            });

            if (response.ok) {
                const alumnos = await response.json();
                tbody.innerHTML = "";

                if (alumnos.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted p-4">No hay alumnos registrados.</td></tr>`;
                    return;
                }

                alumnos.forEach(alumno => {
                    // Validamos si tiene usuario asignado para sacar la matrícula
                    const matricula = alumno.usuario ? alumno.usuario.matricula : "Sin Matrícula";

                    tbody.innerHTML += `
                        <tr>
                            <td class="fw-bold text-primary">${matricula}</td>
                            <td>${alumno.nombre} ${alumno.apellidos}</td>
                            <td>${alumno.carrera}</td>
                            <td>${alumno.semestre}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary" title="Editar"><i class="bi bi-pencil"></i></button>
                                <button class="btn btn-sm btn-outline-danger" title="Dar de baja"><i class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger p-4">Error al cargar datos.</td></tr>`;
            }
        } catch (error) {
            console.error("Error:", error);
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger p-4">Error de conexión con el servidor.</td></tr>`;
        }
    }

    // --- LÓGICA DEL MODAL NUEVO ALUMNO ---
    const btnAbrirModalAlumno = document.getElementById("btnAbrirModalAlumno");
    const formNuevoAlumno = document.getElementById("formNuevoAlumno");
    
    // Instancia del modal de Bootstrap
    const modalAlumno = new bootstrap.Modal(document.getElementById('modalNuevoAlumno'));

    btnAbrirModalAlumno.addEventListener("click", () => {
        formNuevoAlumno.reset(); // Limpiamos el formulario
        modalAlumno.show(); // Mostramos la ventana
    });

    formNuevoAlumno.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btnGuardar = document.getElementById("btnGuardarAlumno");
        btnGuardar.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Guardando...`;
        btnGuardar.disabled = true;

        try {
            // PASO 1: Crear la cuenta de Usuario
            const usuarioData = {
                id: 0,
                matricula: document.getElementById("txtNewMatricula").value,
                passwordHash: document.getElementById("txtNewPassword").value,
                rol: "Alumno"
            };

            const userResponse = await fetch(`${API_URL}/Usuarios`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(usuarioData)
            });

            if (userResponse.ok) {
                const nuevoUsuario = await userResponse.json();

                // PASO 2: Crear el Perfil del Alumno vinculado a ese Usuario
                const alumnoData = {
                    id: 0,
                    nombre: document.getElementById("txtNewNombre").value,
                    apellidos: document.getElementById("txtNewApellidos").value,
                    carrera: document.getElementById("selNewCarrera").value,
                    semestre: document.getElementById("txtNewSemestre").value,
                    usuarioId: nuevoUsuario.id // <- AQUÍ HACEMOS LA CONEXIÓN MÁGICA
                };

                const alumnoResponse = await fetch(`${API_URL}/Alumnos`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify(alumnoData)
                });

                if (alumnoResponse.ok) {
                    modalAlumno.hide(); // Cerramos la ventana
                    cargarDirectorioAlumnos(); // Refrescamos la tabla
                    alert("¡Alumno registrado exitosamente!");
                }
            } else {
                alert("Hubo un error al crear la cuenta de usuario.");
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error de conexión con el servidor.");
        } finally {
            btnGuardar.innerHTML = "Guardar Alumno";
            btnGuardar.disabled = false;
        }
    });
});