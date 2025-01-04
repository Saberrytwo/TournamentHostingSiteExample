using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GameSet.Models.ResponseObjects
{
    public class RegistrationWithTeamDTO
    {
        public int? RegistrationID { get; set; }
        public int? TeamID { get; set; }
        public Guid? GroupID { get; set; }
        public int? TournamentDivisionID { get; set; }
        public int? PoolPlaySeed { get; set; }
        public int? BracketSeed { get; set; }
        public int? TournamentRanking { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }

        // Navigation properties
        public TeamWithUsersDTO? Team { get; set; }
        public Group? Group { get; set; }
        public TournamentDivision? TournamentDivision { get; set; }
    }
}

