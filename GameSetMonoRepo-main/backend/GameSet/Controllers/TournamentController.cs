using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameSet.Models;
using GameSet.Models.ResponseObjects;
using GameSet.Models.RequestObjects;
using GameSet.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GameSet.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TournamentController : Controller
    {
        private readonly IGameSetService _gameSetService;

        public TournamentController(IGameSetService gameSetService)
        {
            _gameSetService = gameSetService;
        }
        [HttpGet("GetTournamentByID")]
        public Tournament GetTournamentByID(int TournamentID)
        {
            return _gameSetService.ReadTournamentByID(TournamentID);
        }

        [HttpGet("GetTournaments")]
        public Tuple<List<Tournament>, List<object>> ListTournaments(double lat, double lng, double Distance, string SearchType, string? UserID)
        {
            return _gameSetService.ReadTournaments(lat, lng, Distance, SearchType, UserID);
        }
        [HttpGet("GetTournamentsByTournamentAdminUserID")]
        public List<Tournament> TournamentsByTournamentAdminUserID(string UserID)
        {
            return _gameSetService.ReadTournamentsByTournamentAdminUserID(UserID);
        }

        [HttpPost("InitializeBracketSeeds")]
        public int InitializeBracketSeeds([FromBody] TournamentDivisionID tournamentDivisionID)
        {
            return _gameSetService.InitializeBracketSeeds(tournamentDivisionID.tournamentDivisionId);
        }

        public class BracketPreparationModel
        {
            public int TournamentDivisionID { get; set; }
            public List<int> RegistrationIDs { get; set; }
        }
        [HttpPost("SetBracketSeeds")]
        public int SetBracketSeeds([FromBody] BracketPreparationModel bracketPreparationModel)
        {
            return _gameSetService.SetBracketSeeds(bracketPreparationModel.TournamentDivisionID, bracketPreparationModel.RegistrationIDs);
        }

        [HttpGet("GetPoolPlayMatches")]
        public IEnumerable<Match> ListPoolPlayMatches(int TournamentDivisionID)
        {
            return _gameSetService.ReadPoolPlayMatchesByTournamentDivisionID(TournamentDivisionID);
        }

        [HttpGet("GetPoolPlayMatchesWithUsers")]
        public IEnumerable<MatchWithRegistrationsDTO> ListPoolPlayMatchesWithUsers(int TournamentDivisionID)
        {
            return _gameSetService.ReadPoolPlayMatchesWithUsersByTournamentDivisionID(TournamentDivisionID);
        }

        // Get Tournament details, tournament admins, tournament status, tournament divisions
        [HttpGet("GetAllTournamentData")]
        public Tuple<Tournament, List<TournamentAdmin>, TournamentStatus, List<Division>> GetAllTournamentData(int TournamentID)
        {
            return _gameSetService.GetAllTournamentData(TournamentID);
        }

        [HttpGet("GetRegistrationsByTournamentDivisionID")]
        public List<Registration> GetRegistrationsByTournamentDivisionID(int TournamentDivisionID)
        {
            return _gameSetService.ReadRegistrationsByTournamentDivisionID(TournamentDivisionID);
        }
        
        [HttpGet("GetRegistrationsByTournamentID")]
        public IEnumerable<Registration> GetRegistrationsByTournamentID(int TournamentID)
        {
            return _gameSetService.ReadRegistrationsByTournamentID(TournamentID);
        }

        [HttpGet("GetMatchesByTournamentDivisionID")]
        public IEnumerable<MatchWithRegistrationsDTO> GetMatchesByTournamentDivisionID(int TournamentDivisionID)
        {
            return _gameSetService.ReadBracketMatchesByTournamentDivisionID(TournamentDivisionID);
        }

        [HttpGet("GetTeamsByUserId")]
        public IEnumerable<Team> ListTeams(string UserID)
        {
            return _gameSetService.ReadTeamsByUserID(UserID);
        }

        [HttpGet("GetDivisionsByTournamentID")]
        public IEnumerable<Division> ListDivisionsForTournament(int TournamentID)
        {
            return _gameSetService.ReadDivisionsByTournamentID(TournamentID);
        }

        [HttpGet("GetTournamentDivisionsByTournamentID")]
        public IEnumerable<TournamentDivision> ListTournamentDivisions(int TournamentID)
        {
            return _gameSetService.ReadTournamentDivisionsByTournamentID(TournamentID);
        }


        [HttpGet("GetTournamentStatuses")]
        public IEnumerable<TournamentStatus> ListTournamentStatuses()
        {
            return _gameSetService.ReadTournamentStatuses();
        }

        [HttpGet("GetTournamentDivisionByTournamentIDAndDivisionID")]
        public TournamentDivision ListTournamentDivisionsByTournamentIDAndDivisionID(int TournamentID, int DivisionID)
        {
            return _gameSetService.ReadTournamentDivisionsByTournamentIDAndDivisionID(TournamentID, DivisionID).First();
        }

        [HttpGet("GetGroupsByTournamentDivisionID")]
        public IEnumerable<Group> ListGroupsByTournamentDivisionID(int TournamentDivisionID)
        {
            return _gameSetService.ReadGroupsByTournamentDivisionID(TournamentDivisionID);
        }

        [HttpGet("GetGroupsAndRegistrationsByTournamentDivisionID")]
        public GroupsListRegistrationList ListGroupsAndRegistrationsByTournamentDivisionID(int TournamentDivisionID)
        {
            return _gameSetService.ReadGroupsAndRegistrationsByTournamentDivisionID(TournamentDivisionID);
        }

        [HttpGet("GetGroupsAndRegistrationsByTournamentDivisionIDByBracket")]
        public GroupsListRegistrationList ListGroupsAndRegistrationsByTournamentDivisionIDByBracket(int TournamentDivisionID)
        {
            return _gameSetService.ReadGroupsAndRegistrationsByTournamentDivisionIDByBracket(TournamentDivisionID);
        }

        [HttpGet("GetTournamentAdminByTournamentID")]
        public IEnumerable<TournamentAdmin> ListTournamentAdminByTournamentID(int TournamentID)
        {
            var response = _gameSetService.ReadTournamentAdminsByTournamentID(TournamentID);

            return response;
        }


        [HttpGet("GetTeamsAndDivisionsByTournamentID")]
        public Dictionary<string, List<TeamWithUsers>> ListDivisionTeamsByTournamentID(int TournamentID)
        {
            Dictionary<string, List<TeamWithUsers>> response = _gameSetService.ReadDivisionTeamsByTournamentID(TournamentID);

            return response;
        }
        [HttpGet("GetUsersByTournamentID")]
        public List<User> ListUsersByTournamentID(int TournamentID)
        {
            List<User> users = _gameSetService.ReadUsersByTournamentID(TournamentID);
            return users;
        }

        [HttpPost("CreateGroup")]
        public void CreateGroup(Guid ID, int rank, int TournamentDivisionID)
        {
            _gameSetService.CreateGroup(ID, rank, TournamentDivisionID);
        }

        [HttpPost("DeleteGroup")]
        public void DeleteGroup(int TournamentDivisionID)
        {
            _gameSetService.DeleteGroup(TournamentDivisionID);
        }

        [HttpDelete("DeleteTournament")]
        public void DeleteTournament(int TournamentId)
        {
            _gameSetService.DeleteTournamentByID(TournamentId);
        }

        [HttpPost("CreateBracketMatches")]
        public void CreateFirstRoundBracketMatches(int TournamentDivisionID)
        {
            _gameSetService.CreateMatchesForBracket(TournamentDivisionID);
        }
        public class TournamentDivisionID
        {
            public int tournamentDivisionId { get; set; }
        }

        [HttpPost("CreatePoolPlayMatches")]
        public void CreatePoolPlayMatches([FromBody] TournamentDivisionID tournamentDivisionID)
        {
            _gameSetService.CreatePoolPlayMatchesForTournamentDivision(tournamentDivisionID.tournamentDivisionId);
        }

        [HttpPost("TryCreateOrUpdateMatch")]
        public int TryCreateOrUpdateMatch(int loserID, int winnerID, int opponentID, int roundNumber)
        {
            return _gameSetService.TryCreateMatch(loserID, winnerID, opponentID, roundNumber);
        }

        [HttpPost("CreateTournament")]
        public Tournament CreateTournament(Tournament tournament)
        {
            return _gameSetService.CreateTournament(tournament);
        }


        [HttpPost("CreateTournamentAndTournamentDivisions")]
        public Tournament CreateTournamentAndTournamentDivisions([FromBody] TournamentCreationRequest request)
        {
            return _gameSetService.CreateTournamentAndTournamentDivisions(request.Tournament, request.DivisionIdList, request.UserID);
        }

        [HttpPost("SetGroupsAndRegistrationsForTournamentDivision")]
        public GroupsListRegistrationList SetGroupAndRegistrations([FromBody] GroupRegistrationRequest request)
        {
            _gameSetService.SetGroupsAndRegistrationsForTournamentDivision(request);
            var response = _gameSetService.ReadGroupsAndRegistrationsByTournamentDivisionID(request.TournamentDivisionID);

            return response;
        }

        [HttpPost("CreateMatchesForGroups")]
        public void CreateMatchesForGroups(Guid groupID, int roundNumber = 0)
        {
            _gameSetService.CreateMatchesForGroup(groupID, roundNumber);
        }

        [HttpPost("CreatePoolPlayGroups")]
        public void CreatePoolPlayGroupsAndMatches([FromBody] PoolPlayModel model)
        {
            _gameSetService.CreateOrUpdateRegistrationGroup(model.Groups, model.TournamentDivisionID);
        }

        [HttpPost("UpdateScoreForMatch")]
        public int UpdateScoreForMatch([FromBody] MatchScoreModel model)
        {
            return _gameSetService.UpdateScore(model.matchID, model.score1, model.score2);
        }

        [HttpPut("UpdateTournament")]
        public void UpdateTournament(Tournament tournament)
        {
            _gameSetService.UpdateTournament(tournament);
        }

        [HttpPost("UpdateTournamentStatus")]
        public IActionResult UpdateTournamentStatus([FromBody] UpdateTournamentStatusRequest request)
        {
            try
            {
                var tournament = _gameSetService.ReadTournamentByID(request.TournamentID);
                tournament.TournamentStatusId = request.StatusID;
                _gameSetService.UpdateTournament(tournament);
                return Ok(); // Returns a 200 OK status code
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest(e.Message);
            }
        }

        [HttpPost("UpdateTournamentAndTournamentDivisions")]
        public IActionResult UpdateTournamentAndTournamentDivisions([FromBody] TournamentCreationRequest request)
        {
            try
            {
                _gameSetService.UpdateTournamentAndTournamentDivisions(request.Tournament, request.DivisionIdList, request.UserID);
                return Ok(new
                {
                    message = "Successfully updated tournament"
                });
            }
            catch (Exception ex)
            {
                // Log the exception details here
                return StatusCode(500, new
                {
                    error = "An error occurred while updating the tournament and its divisions."
                });
            }
        }


        [HttpPost("Register")]
        public int CreateRegistration([FromBody] RegistrationModel model)
        {
            Team team = _gameSetService.ReadTeamByID(model.TeamID);
            TournamentDivision tournamentDivision = _gameSetService.ReadTournamentDivisionsByTournamentIDAndDivisionID(model.TournamentID, model.DivisionID).First();
            Registration registration = new Registration
            {
                TeamID = model.TeamID,
                Team = team,
                TournamentDivision = tournamentDivision,
                TournamentDivisionID = tournamentDivision.TournamentDivisionID
            };
            return _gameSetService.CreateRegistration(registration);
        }

        [HttpDelete("DeleteRegistrationByUserIDAndTournamentID")]
        public void DeleteRegistrationByUserIDAndTournamentID(string UserID, int TournamentID)
        {
            _gameSetService.DeleteRegistrationByUserIDAndTournamentID(UserID, TournamentID);
        }

        public class RegistrationModel
        {
            public int TeamID { get; set; }
            public int TournamentID { get; set; }
            public int DivisionID { get; set; }
        }

        public class MatchScoreModel
        {
            public int matchID { get; set; }
            public int? score1 { get; set; }
            public int? score2 { get; set; }
        }

        public class PoolPlayModel
        {
            public int TournamentDivisionID { get; set; }
            private List<Dictionary<Guid, List<int>>> _groups;

            public List<Dictionary<Guid, List<int>>> Groups
            {
                get { return _groups; }
                set
                {
                    _groups = value;
                    ConvertKeysToGuid();
                }
            }

            private void ConvertKeysToGuid()
            {
                var tempGroup = new List<Dictionary<Guid, List<int>>>();
                foreach (var group in _groups)
                {
                    var convertedDictionary = new Dictionary<Guid, List<int>>();
                    foreach (var kvp in group)
                    {
                        if (Guid.TryParse(kvp.Key.ToString(), out Guid guid))
                        {
                            convertedDictionary.Add(guid, kvp.Value);
                        }
                        else
                        {
                            // Handle invalid GUID string here
                            throw new ArgumentException("Invalid GUID string");
                        }
                    }
                    tempGroup.Add(convertedDictionary);
                }
                _groups = tempGroup;
            }
        }
    }
}

