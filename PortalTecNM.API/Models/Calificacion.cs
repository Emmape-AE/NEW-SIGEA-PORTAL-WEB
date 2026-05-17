namespace PortalTecNM.API.Models
{
    public class Calificacion
    {
        public int Id { get; set; }
        public int Valor { get; set; } // Ejemplo: 85, 90, 100
        public int Unidad { get; set; } // Ejemplo: Unidad 1, Unidad 2, Unidad 3

        // Relación: ¿De qué alumno es esta calificación?
        public int AlumnoId { get; set; }
        public Alumno? Alumno { get; set; }

        // Relación: ¿De qué materia es esta calificación?
        public int MateriaId { get; set; }
        public Materia? Materia { get; set; }
    }
}