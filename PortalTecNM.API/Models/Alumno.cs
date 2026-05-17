namespace PortalTecNM.API.Models
{
    public class Alumno
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellidos { get; set; } = string.Empty;
        public string Carrera { get; set; } = string.Empty;
        public int Semestre { get; set; }
        
        // Relación con el Usuario (Un alumno tiene una cuenta de usuario)
        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }
    }
}