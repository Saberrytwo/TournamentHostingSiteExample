using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace GameSet.Models
{
    public class Group
    {
        [Key]
        public Guid GroupID { get; set; }
        [Required]
        public string? GroupName { get => this.GroupNameCalculated; }
        
        [NotMapped]
        public string GroupNameCalculated
        {
            get => ("Group " + (char)(Order + 64)).ToString();
        }
        [ForeignKey("TournamentDivision")]
        public int TournamentDivisionID { get; set; }
        public int Order {  get; set; }
        // Navigation property
        [Required]
        virtual public TournamentDivision TournamentDivision { get; set; }
    }
}
