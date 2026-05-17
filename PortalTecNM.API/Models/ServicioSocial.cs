namespace PortalTecNM.API.Models
{
    public class ServicioSocial
    {
        public int Id { get; set; }
        public string Dependencia { get; set; } = string.Empty; // Ej. "H. Ayuntamiento"
        public string Programa { get; set; } = string.Empty; 
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaTermino { get; set; } // El signo '?' significa que puede ser nulo (si aún no termina)
        public string Estatus { get; set; } = "Iniciado"; // Iniciado, Documentación, Liberado

        // Relación con el alumno
        public int AlumnoId { get; set; }
        public Alumno? Alumno { get; set; }
    }
}