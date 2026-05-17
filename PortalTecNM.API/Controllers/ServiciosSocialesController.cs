using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortalTecNM.API.Data;
using PortalTecNM.API.Models;

namespace PortalTecNM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiciosSocialesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServiciosSocialesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: Ver el estatus del servicio social de los alumnos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServicioSocial>>> GetServiciosSociales()
        {
            return await _context.ServiciosSociales
                .Include(s => s.Alumno)
                .ToListAsync();
        }

        // POST: Iniciar un nuevo trámite de servicio social
        [HttpPost]
        public async Task<ActionResult<ServicioSocial>> PostServicioSocial(ServicioSocial servicio)
        {
            _context.ServiciosSociales.Add(servicio);
            await _context.SaveChangesAsync();

            return Ok(servicio);
        }
    }
}