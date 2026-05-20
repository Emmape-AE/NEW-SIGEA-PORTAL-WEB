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

});