using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PortalTecNM.API.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PortalTecNM.API.Controllers
{
    // Clase auxiliar para recibir los datos del formulario de login
    public class LoginRequest
    {
        public string Matricula { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        // Necesitamos la base de datos (para buscar al usuario) y la configuración (para leer la clave secreta)
        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // 1. Buscamos al usuario en la base de datos por su matrícula
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Matricula == request.Matricula);

            // 2. Verificamos si existe y si la contraseña coincide 
            // (En un sistema real la contraseña estaría encriptada, aquí hacemos validación directa para el ejemplo)
            if (usuario == null || usuario.PasswordHash != request.Password)
            {
                return Unauthorized("Matrícula o contraseña incorrectos."); // 401 si falla
            }

            // 3. ¡Si llegamos aquí, los datos son correctos! Empezamos a fabricar el gafete (Token)
            var jwtSettings = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // 4. Le ponemos los "sellos" al gafete: Quién es (Matrícula) y qué Rol tiene (Alumno/Admin)
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Matricula),
                new Claim(ClaimTypes.Role, usuario.Rol)
            };

            // 5. Imprimimos el Token con caducidad de 1 hora
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            // 6. Se lo entregamos al usuario
            return Ok(new
            {
                mensaje = "Login exitoso",
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });
        }
    }
}