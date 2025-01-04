using System.ComponentModel.DataAnnotations;

namespace GameSet.Models
{
    public class User
    {
        [Required]
        [Key]
        public string UserID { get; set; }
        [Required]
        public string UserName { get; set; }
        public string? ImageURL { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public DateTime? Birthdate { get; set; } = null;
        public string? Zipcode { get; set; }
        public string? Gender { get; set; }
    }
}
