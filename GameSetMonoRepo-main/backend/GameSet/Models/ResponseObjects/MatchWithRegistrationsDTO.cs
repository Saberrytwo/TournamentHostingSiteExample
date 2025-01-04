using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GameSet.Models.ResponseObjects
{
    public class MatchWithRegistrationsDTO
    {
        public int? MatchID { get; set; }
        public int? RegistrationID1 { get; set; }
        public int? RegistrationID2 { get; set; }
        public int? TournamentDivisionID { get; set; }
        public int? Score1 { get; set; }
        public int? Score2 { get; set; }
        public int? MatchNumber { get; set; }
        public int? RoundNumber { get; set; }

        // Navigation properties
        public RegistrationWithTeamDTO? Registration1 { get; set; }
        public RegistrationWithTeamDTO? Registration2 { get; set; }
    }
}

