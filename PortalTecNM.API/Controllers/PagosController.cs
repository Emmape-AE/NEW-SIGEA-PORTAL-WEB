using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortalTecNM.API.Data;
using PortalTecNM.API.Models;

namespace PortalTecNM.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PagosController(AppDbContext context)
        {
            _context = context;
        }

        //GET: Ver todos los recibos con los datos del alumno y lo que esta pagando
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pago>>> GetPagos()
        {
            return await _context.Pagos
                                 .Include(p => p.Alumno)
                                 .Include(p => p.ConceptoPago)
                                 .ToListAsync();
        }

        //POST: Generar un nuevo recibo (¡Genera la referencia bancaria automaticamente!)
        [HttpPost]
        public async Task<ActionResult<Pago>> PostPago(Pago pago)
        {
            //Generamos una referencia falsa pero que parece real: REF-AÑO-MES-DIA-ALUMNO-CONCEPTO

            string fecha = DateTime.Now.ToString("yyyyMMdd");
            pago.ReferenciaBancaria = $"REF-{fecha}-{pago.AlumnoId}{pago.ConceptoPagoId}{new Random().Next(100,999)}";

            pago.FechaSolicitud = DateTime.Now;
            pago.Estatus = "Pendiente";

            _context.Pagos.Add(pago);
            await _context.SaveChangesAsync();

            return Ok(pago);
        }
    }
}