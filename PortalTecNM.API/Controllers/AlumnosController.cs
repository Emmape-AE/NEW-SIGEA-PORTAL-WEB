using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortalTecNM.API.Data;
using PortalTecNM.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace PortalTecNM.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AlumnosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AlumnosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Alumnos (Obtiene la lista de todos los alumnos)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Alumno>>> GetAlumnos()
        {
            return await _context.Alumnos
                                 .Include(a => a.Usuario) // <-- AGREGA ESTA LÍNEA
                                 .ToListAsync();
        }

        // POST: api/Alumnos (Guarda un nuevo alumno en la base de datos)
        [HttpPost]
        public async Task<ActionResult<Alumno>> PostAlumno(Alumno alumno)
        {
            _context.Alumnos.Add(alumno);
            await _context.SaveChangesAsync();

            return Ok(alumno);
        }
    }
}