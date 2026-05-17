namespace PortalTecNM.API.Models
{
    public class Pago
    {
        public int Id { get; set; }
        public DateTime FechaSolicitud { get; set; } = DateTime.Now;
        public string Estatus { get; set; } = "Pendiente"; // Puede ser Pendiente, Pagado, Cancelado
        public string ReferenciaBancaria { get; set; } = string.Empty; // La línea de captura para el banco

        // Relación: ¿Quién debe pagar esto?
        public int AlumnoId { get; set; }
        public Alumno? Alumno { get; set; }

        // Relación: ¿Qué está pagando?
        public int ConceptoPagoId { get; set; }
        public ConceptoPago? ConceptoPago { get; set; }
    }
}