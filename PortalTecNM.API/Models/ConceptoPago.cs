using System.ComponentModel.DataAnnotations.Schema; // <-- Agrega esto

namespace PortalTecNM.API.Models
{
    public class ConceptoPago
    {
        public int Id { get; set; }
        public string Clave { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(18,2)")] // <-- Esto le dice a SQL que son 18 dígitos en total, 2 de ellos decimales
        public decimal Monto { get; set; } 
    }
}