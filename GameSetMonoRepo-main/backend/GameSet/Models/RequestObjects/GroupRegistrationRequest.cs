namespace GameSet.Models.RequestObjects;

public class GroupRegistrationRequest
{
    public  IEnumerable<Guid> GroupList { get; set; } = new List<Guid>();
    public Dictionary<Guid, IEnumerable<int>> RegistrationIDsPerGroup { get; set; } = new();
    public int TournamentDivisionID { get; set; }
}