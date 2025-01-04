using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace GameSet.Models
{
    public class Registration
    {
        [Key]
        public int RegistrationID { get; set; }
        [ForeignKey("Team")]
        public int TeamID { get; set; }
        [ForeignKey("Group")]
        public Guid? GroupID { get; set; }
        [ForeignKey("TournamentDivision")]
        public int TournamentDivisionID { get; set; }
        public int? PoolPlaySeed { get; set; }
        public int? BracketSeed { get; set; }
        public int? TournamentRanking { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        [StringLength(1000)] // Adjust the length as per your database schema if needed
        public string? Notes { get; set; }
        // Navigation properties
        [Required]
        public virtual Team Team { get; set; }
        public virtual Group? Group { get; set; }
        public virtual TournamentDivision TournamentDivision { get; set; }
    }
}
