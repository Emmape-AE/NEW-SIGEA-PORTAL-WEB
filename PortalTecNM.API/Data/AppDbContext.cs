using Microsoft.EntityFrameworkCore;
using PortalTecNM.API.Models;

namespace PortalTecNM.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Estas son las tablas que se van a crear en la base de datos
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Alumno> Alumnos { get; set; }
        public DbSet<Materia> Materias { get; set; }
        public DbSet<Calificacion> Calificaciones { get; set; }
        public DbSet<ConceptoPago> ConceptosPago { get; set; }
        public DbSet<Pago> Pagos { get; set; }
        public DbSet<ActividadComplementaria> ActividadesComplementarias { get; set; }
        public DbSet<ServicioSocial> ServiciosSociales { get; set; }
        public DbSet<HorarioClase> Horarios { get; set; } // <-- AGREGA ESTA LÍNEA
    }
}