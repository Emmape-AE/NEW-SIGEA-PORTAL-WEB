using System.Text.Json.Serialization;

namespace PortalTecNM.API.Models
{
    public class HorarioClase
    {
        public int Id { get; set; }
        public string Dia { get; set; } = string.Empty; // Ej. "Lunes"
        public string Hora { get; set; } = string.Empty; // Ej. "07:00 - 08:00"
        public string Aula { get; set; } = string.Empty; // Ej. "Lab 2"

        // Relación con el Alumno
        public int AlumnoId { get; set; }
        [JsonIgnore]
        public Alumno? Alumno { get; set; }

        // Relación con la Materia
        public int MateriaId { get; set; }
        public Materia? Materia { get; set; }
    }
}