using System.ComponentModel.DataAnnotations;

namespace API.DTOs;
public class RegisterDto
{
    [Required]
    public string DisplayName { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "Password must be between 4-8 characters and must contain at least 1 uppercase letter, 1 lowercase letter and 1 number.")]
    public string Password { get; set; }
    [Required]
    public string UserName { get; set; }
}