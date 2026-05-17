using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortalTecNM.API.Data;
using PortalTecNM.API.Models;

namespace PortalTecNM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConceptosPagoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConceptosPagoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConceptoPago>>> GetConceptos()
        {
            return await _context.ConceptosPago
                                 .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<ConceptoPago>> PostConcepto(ConceptoPago concepto)
        {
            _context.ConceptosPago.Add(concepto);
            await _context.SaveChangesAsync();

            return Ok(concepto);
        }
    }
}