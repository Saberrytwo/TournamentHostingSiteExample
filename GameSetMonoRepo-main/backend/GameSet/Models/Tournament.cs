using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GameSet.Models
{
    public class Tournament
    {
        [Key]
        public int TournamentID { get; set; }
        [Required]
        public string TournamentTitle { get; set; }
        [Required]
        [StringLength(255)] // Adjust the length as per your database schema if needed
        public string Address1 { get; set; }
        [StringLength(255)] // Adjust the length as per your database schema if needed
        public string? Address2 { get; set; }
        [Required]
        [StringLength(100)] // Adjust the length as per your database schema if needed
        public string City { get; set; }
        [Required]
        [StringLength(50)] // Adjust the length as per your database schema if needed
        public string State { get; set; }
        [Required]
        [StringLength(10)] // Adjust the length as per your database schema if needed
        public string Zipcode { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public DateTime RegistrationStartDate { get; set; }
        [Required]
        public DateTime RegistrationEndDate { get; set; }
        [StringLength(1000)] // Adjust the length as per your database schema if needed
        public string? Description { get; set; }
        
        // Add the following properties for latitude, longitude, and image URL
        public double? Latitude { get; set; }
        
        public double? Longitude { get; set; }
        
        public double? RegistrationFee { get; set; }

        [StringLength(255)]
        public string? ImageUrl { get; set; }

        [ForeignKey("TournamentStatus")] public int TournamentStatusId { get; set; } = 10;

    }
}
