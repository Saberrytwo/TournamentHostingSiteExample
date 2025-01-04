using System.Collections.Generic;
using GameSet.Models;

public class TeamWithUsers
{
    public Team Team { get; set; }
    public List<User> Users { get; set; }
    public List<UserTeamStatus> UserTeamStatuses { get; set; }
}