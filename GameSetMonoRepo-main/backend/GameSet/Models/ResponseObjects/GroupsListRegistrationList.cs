namespace GameSet.Models.RequestObjects;

public class GroupsListRegistrationList
{
    public IEnumerable<Group> GroupList { get; set; } = new List<Group>();
    public IEnumerable<Registration> RegistrationList { get; set; } = new List<Registration>();
}