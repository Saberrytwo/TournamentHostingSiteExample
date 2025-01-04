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
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public string? PhoneNumber { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public DateTime Birthdate { get; set; }
        [Required]
        public string Zipcode { get; set; }
        [Required]
        public string Gender { get; set; }
    }
}
