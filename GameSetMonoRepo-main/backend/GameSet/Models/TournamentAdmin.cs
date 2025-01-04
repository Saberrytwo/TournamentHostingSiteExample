using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace GameSet.Models
{
    public class TournamentAdmin
    {
        // Primary Key
        [Key]
        public int TournamentAdminID { get; set; }
        // Foreign Key - Tournament
        [ForeignKey("Tournament")]
        public int TournamentID { get; set; }
        // Foreign Key - UserID
        [ForeignKey("User")]
        public string UserID { get; set; }  // Assuming UserID is of type varchar (string in C#)
        [Required]
        public string Role { get; set; }  // Assuming Roles is of type varchar (string in C#)
        // Navigation Property
        [Required]
        public virtual Tournament Tournament { get; set; }
        [Required]
        public virtual User User { get; set; }  // Assuming you have a User class defined elsewhere
    }
}
