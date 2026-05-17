using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortalTecNM.API.Data;
using PortalTecNM.API.Models;

namespace PortalTecNM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActividadesComplementariasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ActividadesComplementariasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: Ver todas las actividades registradas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActividadComplementaria>>> GetActividades()
        {
            return await _context.ActividadesComplementarias
                .Include(a => a.Alumno)
                .ToListAsync();
        }

        // POST: Registrar una nueva actividad a un alumno
        [HttpPost]
        public async Task<ActionResult<ActividadComplementaria>> PostActividad(ActividadComplementaria actividad)
        {
            _context.ActividadesComplementarias.Add(actividad);
            await _context.SaveChangesAsync();

            return Ok(actividad);
        }
    }
}