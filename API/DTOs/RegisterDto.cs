using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string UserName { get; set; }
        
        [Required]
        [MinLength(6, ErrorMessage = "El password es demasiado corto")]
        public string Password { get; set; }
    }
}