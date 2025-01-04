namespace GameSet.Models.RequestObjects;

public class UpdateTournamentStatusRequest
{
    public int TournamentID { get; set; }
    public int StatusID { get; set; }
}
