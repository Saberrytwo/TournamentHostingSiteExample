using System;
using System.ComponentModel.DataAnnotations;

namespace GameSet.Models.ResponseObjects
{
    public class TeamWithUsersDTO
    {
        public int? TeamID { get; set; }
        public string? TeamName { get; set; }
        public bool Public { get; set; } = true;
        public string? TeamDescription { get; set; }
        public List<User>? Users { get; set; }
    }
}

