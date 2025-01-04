using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace GameSet.Models
{
    public class TournamentDivision
    {
        // Primary Key
        [Key]
        public int TournamentDivisionID { get; set; }
        // Foreign Key
        [ForeignKey("Division")]
        public int DivisionID { get; set; }
        [ForeignKey("Tournament")]
        public int TournamentID { get; set; }

        // Navigation Property
        [Required]
        public virtual Division Division { get; set; }
        [Required]
        public virtual Tournament Tournament { get; set; }
    }
}
