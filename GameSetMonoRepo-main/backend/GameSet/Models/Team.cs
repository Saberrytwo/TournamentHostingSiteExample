using System.ComponentModel.DataAnnotations;

namespace GameSet.Models
{
    public class Team
    {
        [Key]
        public int TeamID { get; set; }
        [Required]
        [StringLength(255)] // Adjust the length as per your database schema if needed
        public string TeamName { get; set; }
        [Required]
        public bool Public { get; set; } = true;
        [StringLength(1000)] // Adjust the length as per your database schema if needed
        public string? TeamDescription { get; set; }
    }
}
