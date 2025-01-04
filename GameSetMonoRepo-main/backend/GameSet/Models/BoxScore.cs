using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace GameSet.Models
{
    public class BoxScore
    {
        [Key]
        public int BoxScoreID { get; set; }
        [ForeignKey("User")]
        [Required]
        public string UserID { get; set; }
        [ForeignKey("Match")]
        public int MatchID { get; set; }
        [ForeignKey("UserTeam")]
        public int UserTeamID { get; set; }
        // Navigation properties
        [Required]
        virtual public User User { get; set; }
        [Required]
        virtual public Match Match { get; set; }
    }
}
