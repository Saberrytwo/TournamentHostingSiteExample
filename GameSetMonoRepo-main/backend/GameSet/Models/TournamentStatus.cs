using System.ComponentModel.DataAnnotations;

namespace GameSet.Models
{
    public class TournamentStatus
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }

}


