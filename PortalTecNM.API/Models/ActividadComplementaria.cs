namespace PortalTecNM.API.Models
{
    public class ActividadComplementaria
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty; // Ej. "Tutorías", "Basquetbol"
        public int Creditos { get; set; }
        public int Horas { get; set; }
        public string Estatus { get; set; } = "En Curso"; // En Curso, Liberada

        // Relación: ¿De qué alumno es esta actividad?
        public int AlumnoId { get; set; }
        public Alumno? Alumno { get; set; }
    }
}