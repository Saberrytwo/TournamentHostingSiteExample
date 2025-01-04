using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace GameSet.Models
{
    public class UserTeamStatus
    {
        [Key]
        public int UserTeamID { get; set; }
        [ForeignKey("User")]
        public string UserID { get; set; }
        [ForeignKey("Team")]
        public int TeamID { get; set; }
        [Required]
        public string Status { get; set; }
        [Required]
        public DateTime Timestamp { get; set; }
        public string? InviteURL { get; set; }
        // Navigation properties
        [Required]
        virtual public User User { get; set; }
        [Required]
        virtual public Team Team { get; set; }
    }
}
