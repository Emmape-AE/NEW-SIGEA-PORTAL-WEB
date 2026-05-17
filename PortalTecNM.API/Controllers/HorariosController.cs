using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortalTecNM.API.Data;
using PortalTecNM.API.Models;

namespace PortalTecNM.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class HorariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HorariosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Horarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HorarioClase>>> GetHorarios()
        {
            return await _context.Horarios
                .Include(h => h.Materia) // Traemos los datos de la materia
                .ToListAsync();
        }

        // POST: api/Horarios
        [HttpPost]
        public async Task<ActionResult<HorarioClase>> PostHorario(HorarioClase horario)
        {
            _context.Horarios.Add(horario);
            await _context.SaveChangesAsync();
            return Ok(horario);
        }
    }
}