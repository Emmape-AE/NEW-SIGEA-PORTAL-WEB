using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortalTecNM.API.Data;
using PortalTecNM.API.Models;

namespace PortalTecNM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalificacionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CalificacionesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Calificaciones (Obtiene las calificaciones con detalles de Alumno y Materia)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Calificacion>>> GetCalificaciones()
        {
            return await _context.Calificaciones
                .Include(c => c.Alumno)   // Trae los datos del alumno
                .Include(c => c.Materia)  // Trae los datos de la materia
                .ToListAsync();
        }

        // POST: api/Calificaciones (Registra una nueva calificación)
        [HttpPost]
        public async Task<ActionResult<Calificacion>> PostCalificacion(Calificacion calificacion)
        {
            _context.Calificaciones.Add(calificacion);
            await _context.SaveChangesAsync();

            return Ok(calificacion);
        }
    }
}