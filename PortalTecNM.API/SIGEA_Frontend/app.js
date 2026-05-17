const API_URL = "http://localhost:5289/api";

document.addEventListener("DOMContentLoaded", () => {
    // Referencias a las pantallas
    const loginView = document.getElementById("loginView");
    const dashboardView = document.getElementById("dashboardView");

    const perfilView = document.getElementById("perfilView");
    const calificacionesView = document.getElementById("calificacionesView");
    const btnMenuPerfil = document.getElementById("btnMenuPerfil");
    const btnMenuCalificaciones = document.getElementById("btnMenuCalificaciones");
    const horarioView = document.getElementById("horarioView");
    const btnMenuHorario = document.getElementById("btnMenuHorario");
    const pagosView = document.getElementById("pagosView");
    const btnMenuPagos = document.getElementById("btnMenuPagos");
    
    // Referencias al formulario y botones
    const loginForm = document.getElementById("loginForm");
    const btnLogout = document.getElementById("btnLogout");
    const loginError = document.getElementById("loginError");

    // 1. Verificar si ya tenemos un "gafete" guardado al cargar la página
    const token = localStorage.getItem("jwt_token");
    if (token) {
        mostrarDashboard();
    }

    // 2. Evento: Cuando el usuario le da a "Iniciar Sesión"
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        
        const matricula = document.getElementById("txtMatricula").value;
        const password = document.getElementById("txtPassword").value;

        try {
            // Mandamos los datos al guardia del Backend
            const response = await fetch(`${API_URL}/Auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ matricula: matricula, password: password })
            });

            if (response.ok) {
                const data = await response.json();
                // ¡Aprobado! Guardamos el token en la caja fuerte del navegador
                localStorage.setItem("jwt_token", data.token);
                mostrarDashboard();
                loginError.style.display = "none";
            } else {
                // Rechazado: Mostramos error
                loginError.innerText = "Matrícula o contraseña incorrectos.";
                loginError.style.display = "block";
            }
        } catch (error) {
            loginError.innerText = "Error al conectar con el servidor.";
            loginError.style.display = "block";
            console.error(error);
        }
    });

    // 3. Evento: Cuando el usuario le da a "Cerrar Sesión"
    btnLogout.addEventListener("click", () => {
        localStorage.removeItem("jwt_token"); // Destruimos el gafete
        loginView.style.setProperty("display", "flex", "important"); // Mostramos Login
        dashboardView.style.setProperty("display", "none", "important"); // Ocultamos Dashboard
        loginForm.reset(); // Limpiamos las cajas de texto
    });

    // --- NAVEGACIÓN DEL MENÚ LATERAL ---
    btnMenuPerfil.addEventListener("click", () => {
        calificacionesView.style.display = "none";
        horarioView.style.display = "none";
        pagosView.style.display = "none"; // <-- Nueva
        perfilView.style.display = "block";
    });

    btnMenuCalificaciones.addEventListener("click", () => {
        perfilView.style.display = "none";
        horarioView.style.display = "none";
        pagosView.style.display = "none"; // <-- Nueva
        calificacionesView.style.display = "block";
        cargarCalificaciones();
    });

    btnMenuHorario.addEventListener("click", () => {
        perfilView.style.display = "none";
        calificacionesView.style.display = "none";
        pagosView.style.display = "none"; // <-- Nueva
        horarioView.style.display = "block";
        cargarHorario();
    });

    // --- NUEVO BOTÓN DE PAGOS ---
    btnMenuPagos.addEventListener("click", () => {
        perfilView.style.display = "none";
        calificacionesView.style.display = "none";
        horarioView.style.display = "none";
        pagosView.style.display = "block";
        cargarPagos(); // Llamamos a la API
    });
    
    // --- Funciones de ayuda ---
    function mostrarDashboard() {
        loginView.style.setProperty("display", "none", "important");
        dashboardView.style.setProperty("display", "flex", "important");
        checkApiStatus();
        cargarDatosAlumno(); // <-- AGREGA ESTA LÍNEA
    }

    async function checkApiStatus() {
        const statusBadge = document.getElementById("api-status");
        statusBadge.innerText = "API Conectada (🔒 Autenticado)";
        statusBadge.className = "badge bg-success";
    }

    // --- NUEVA FUNCIÓN PARA TRAER LOS DATOS REALES ---
    async function cargarDatosAlumno() {
        const token = localStorage.getItem("jwt_token");
        const dataDisplay = document.getElementById("dataDisplay");
        const welcomeTitle = document.getElementById("welcomeTitle");

        dataDisplay.innerHTML = '<div class="spinner-border text-primary" role="status"></div> Cargando datos...';

        try {
            // Hacemos la petición al Backend, pero esta vez llevando el "gafete" en los Headers
            const response = await fetch(`${API_URL}/Alumnos`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}` // <-- AQUÍ PRESENTAMOS EL GAFETE
                }
            });

            if (response.ok) {
                const alumnos = await response.json();
                
                // Como nos trae la lista de alumnos, tomamos el primero (Carlos Peña)
                const alumno = alumnos[0]; 
                console.log("Datos exactos del servidor:", alumno);

                // Pintamos el título
                welcomeTitle.innerText = `¡Hola, ${alumno.nombre} ${alumno.apellidos}!`;
                
                // Pintamos las tarjetas con su información
                dataDisplay.innerHTML = `
                    <div class="row mt-4">
                        <div class="col-md-6 mb-3">
                            <div class="card p-3 border-start border-primary border-4">
                                <h5 class="text-primary"><i class="bi bi-person-badge"></i> Perfil Académico</h5>
                                <hr>
                                <p class="mb-1"><strong>Matrícula:</strong> ${alumno.usuario.matricula}</p>
                                <p class="mb-1"><strong>Carrera:</strong> ${alumno.carrera}</p>
                                <p class="mb-1"><strong>Semestre:</strong> ${alumno.semestre}</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="card p-3 border-start border-success border-4">
                                <h5 class="text-success"><i class="bi bi-envelope"></i> Contacto</h5>
                                <hr>
                                <p class="mb-1"><strong>Correo:</strong> ${alumno.nombre.toLowerCase()}@tecnm.mx</p>
                                <p class="mb-1"><strong>Estatus:</strong> Activo <i class="bi bi-check-circle-fill text-success"></i></p>
                                <p class="mb-1"><strong>Rol en Sistema:</strong> ${alumno.usuario.rol}</p>
                            </div>
                        </div>
                    </div>
                `;
            } else if (response.status === 401) {
                // Si el token ya caducó (pasó más de 1 hora)
                btnLogout.click(); // Lo sacamos del sistema
                alert("Tu sesión ha expirado por seguridad. Vuelve a iniciar sesión.");
            }
        } catch (error) {
            console.error("Error al traer los datos:", error);
            dataDisplay.innerHTML = `<p class="text-danger">Error al cargar la información del servidor.</p>`;
        }
    }

    // --- FUNCIÓN PARA TRAER CALIFICACIONES ---
    async function cargarCalificaciones() {
        const token = localStorage.getItem("jwt_token");
        const tbody = document.getElementById("tablaCalificaciones");

        try {
            const response = await fetch(`${API_URL}/Calificaciones`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const calificaciones = await response.json();
                tbody.innerHTML = ""; // Limpiamos la tabla
                
                // Si no hay calificaciones
                if (calificaciones.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No hay calificaciones registradas aún.</td></tr>`;
                    return;
                }

                // Dibujamos cada calificación en la tabla
                calificaciones.forEach(cal => {
                    // Validamos si aprobó o reprobó para ponerle color (Usamos cal.valor)
                    const colorNota = cal.valor >= 70 ? "text-success fw-bold" : "text-danger fw-bold";
                    const estatus = cal.valor >= 70 ? "Aprobada" : "Reprobada";
                    const icono = cal.valor >= 70 ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger";

                    // Dibujamos la fila
                    tbody.innerHTML += `
                        <tr>
                            <td>${cal.materia.nombre}</td>
                            <td>${cal.materia.creditos}</td>
                            <td class="${colorNota}">${cal.valor}</td>
                            <td><i class="bi ${icono}"></i> ${estatus}</td>
                        </tr>
                    `;
                });
            }
        } catch (error) {
            console.error("Error al cargar calificaciones:", error);
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar los datos.</td></tr>`;
        }
    }

    // --- FUNCIÓN PARA CONSTRUIR EL HORARIO REAL DESDE LA API ---
    async function cargarHorario() {
        const token = localStorage.getItem("jwt_token");
        const tbody = document.getElementById("tablaHorario");

        // Mostramos un spinner de carga mientras responde el servidor
        tbody.innerHTML = `<tr><td colspan="6" class="text-center"><div class="spinner-border text-primary btn-sm" role="status"></div> Cargando horario oficial...</td></tr>`;

        try {
            const response = await fetch(`${API_URL}/Horarios`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const horarios = await response.json();
                tbody.innerHTML = ""; // Limpiamos el mensaje de carga

                // 1. Definimos la matriz de filas (Horas) y columnas (Días)
                const bloquesHoras = ["07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00"];
                const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

                // 2. Recorremos cada bloque de hora (Fila por fila)
                bloquesHoras.forEach(horaBloque => {
                    let filaHTML = `<tr><td class="fw-bold bg-light align-middle">${horaBloque}</td>`;

                    // 3. Para cada hora, revisamos los 5 días de la semana (Columna por columna)
                    diasSemana.forEach(dia => {
                        
                        // Buscamos si la API nos trajo una clase que coincida con este DÍA y esta HORA
                        const claseEncontrada = horarios.find(h => 
                            h.dia.toLowerCase() === dia.toLowerCase() && 
                            h.hora === horaBloque
                        );

                        if (claseEncontrada) {
                            // Asignamos un color CSS diferente según la materia para que se vea pro
                            const colorTarjeta = claseEncontrada.materiaId === 1 ? "table-primary" : "table-success";
                            
                            filaHTML += `
                                <td class="${colorTarjeta} text-center p-3 animate__animated animate__fadeIn">
                                    <div class="fw-bold text-dark mb-1">${claseEncontrada.materia.nombre}</div>
                                    <span class="badge bg-dark bg-opacity-10 text-dark sub-text"><i class="bi bi-geo-alt"></i> ${claseEncontrada.aula}</span>
                                </td>`;
                        } else {
                            // Si no hay clase en este día y hora, ponemos un guion limpio
                            filaHTML += `<td class="text-muted align-middle">-</td>`;
                        }
                    });

                    filaHTML += `</tr>`;
                    tbody.innerHTML += filaHTML; // Inyectamos la fila completa en la tabla
                });

                // Si por alguna razón la API devolvió una lista vacía
                if (horarios.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted p-4">No tienes clases asignadas en tu horario.</td></tr>`;
                }

            } else {
                tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error del servidor: ${response.status}</td></tr>`;
            }
        } catch (error) {
            console.error("Error al conectar con /api/Horarios:", error);
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error de conexión. Verifica que el Backend esté corriendo.</td></tr>`;
        }
    }

    // --- FUNCIÓN PARA TRAER LOS PAGOS REALES ---
    async function cargarPagos() {
        const token = localStorage.getItem("jwt_token");
        const tbody = document.getElementById("tablaPagos");

        try {
            const response = await fetch(`${API_URL}/Pagos`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const pagos = await response.json();
                tbody.innerHTML = ""; 

                if (pagos.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No tienes pagos pendientes ni registrados.</td></tr>`;
                    return;
                }

                pagos.forEach(pago => {
                    // Le damos formato de moneda al monto
                    const montoFormateado = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(pago.conceptoPago.monto);
                    
                    // Formateamos la fecha a algo legible (ej. 16/05/2026)
                    const fecha = new Date(pago.fechaSolicitud).toLocaleDateString('es-MX');

                    // Colores según el estatus
                    let badgeEstatus = "";
                    if(pago.estatus === "Pendiente") badgeEstatus = `<span class="badge bg-warning text-dark"><i class="bi bi-hourglass-split"></i> Pendiente</span>`;
                    else if (pago.estatus === "Pagado") badgeEstatus = `<span class="badge bg-success"><i class="bi bi-check-circle"></i> Pagado</span>`;
                    else badgeEstatus = `<span class="badge bg-danger">${pago.estatus}</span>`;

                    tbody.innerHTML += `
                        <tr>
                            <td class="fw-bold">${pago.conceptoPago.nombre}</td>
                            <td><code class="text-primary fs-6">${pago.referenciaBancaria}</code></td>
                            <td>${fecha}</td>
                            <td class="fw-bold text-success">${montoFormateado}</td>
                            <td>${badgeEstatus}</td>
                        </tr>
                    `;
                });
            }
        } catch (error) {
            console.error("Error al cargar pagos:", error);
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error al cargar el estado de cuenta.</td></tr>`;
        }
    }
});