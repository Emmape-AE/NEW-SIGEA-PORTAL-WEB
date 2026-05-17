namespace PortalTecNM.API.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Matricula { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Rol { get; set; } = "Alumno"; // Puede ser Alumno, Docente, Admin
    }
}