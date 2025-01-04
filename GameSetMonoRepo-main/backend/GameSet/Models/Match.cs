using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GameSet.Models
{
    public class Match
    {

        [Key]
        public int MatchID { get; set; }
        [ForeignKey("Registration1")]
        public int? RegistrationID1 { get; set; }
        [ForeignKey("Registration2")]
        public int? RegistrationID2 { get; set; }
        [ForeignKey("TournamentDivisionID")]
        public int TournamentDivisionID { get; set; }
        public int? Score1 { get; set; }
        public int? Score2 { get; set; }
        public int MatchNumber { get; set; }
        [Required]
        public int RoundNumber { get; set; }
        // Navigation properties
        public virtual Registration? Registration1 { get; set; }
        public virtual Registration? Registration2 { get; set; }
    }
}
