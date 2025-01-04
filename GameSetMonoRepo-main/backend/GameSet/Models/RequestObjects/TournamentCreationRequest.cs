namespace GameSet.Models.RequestObjects;

public class TournamentCreationRequest
{
    public Tournament Tournament { get; set; }
    public IEnumerable<int> DivisionIdList { get; set; }
    public string UserID { get; set; }
}