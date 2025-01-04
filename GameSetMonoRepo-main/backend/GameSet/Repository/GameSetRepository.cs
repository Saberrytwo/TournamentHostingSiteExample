using GameSet.Models;
using GameSet.Models.ResponseObjects;
using Geolocation;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;

namespace GameSet.Repository
{
    public class GameSetRepository : IGameSetRepository
    {
        private readonly GameSetDbContext _dbContext;
        public GameSetRepository(GameSetDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /*--------------- CREATE METHODS --------------*/
        #region Create Methods
        // sort by models
        public void CreateUser(User user)
        {
            _dbContext.User.Add(user);
            _dbContext.SaveChanges();
        }

        public Tournament CreateTournament(Tournament tournament)
        {
            _dbContext.Tournament.Add(tournament);
            _dbContext.SaveChanges();
            return tournament;
        }

        public void CreateTournamentDivision(int tournamentID, int divisionID)
        {
            _dbContext.TournamentDivision.Add(new TournamentDivision
            { TournamentID = tournamentID, DivisionID = divisionID });
            _dbContext.SaveChanges();
        }

        public void CreateGroup(Guid id, int rank, int TournamentDivisionID)
        {
            var TournamentDivision = _dbContext.TournamentDivision.First(x => x.TournamentDivisionID == TournamentDivisionID);
            var group = new Group { GroupID = id, Order = rank, TournamentDivision = TournamentDivision };
            _dbContext.Group.Add(group);
            _dbContext.SaveChanges();
        }

        public void CreateGroup(Group group)
        {
            _dbContext.Group.Add(group);
            _dbContext.SaveChanges();
        }

        public int CreateMatch(Registration registration1, Registration registration2, int roundNumber, int matchNumber)
        {
            _dbContext.Match.Add(new Match { RegistrationID1 = registration1.RegistrationID, RegistrationID2 = registration2.RegistrationID, Registration1 = registration1, Registration2 = registration2, RoundNumber = roundNumber, TournamentDivisionID = registration1.TournamentDivisionID, MatchNumber = matchNumber });
            if(_dbContext.SaveChanges() > 0)
            {
                return StatusCodes.Status200OK;
            }
            else
            {
                return StatusCodes.Status304NotModified;
            }
        }

        public int CreateMatch(int roundNumber, int tournamentDivisionID, int matchNumber)
        {
            _dbContext.Add(new Match { RoundNumber = roundNumber, TournamentDivisionID = tournamentDivisionID, MatchNumber = matchNumber });
            if (_dbContext.SaveChanges() > 0)
            {
                return StatusCodes.Status200OK;
            }
            else
            {
                return StatusCodes.Status304NotModified;
            }
        }

        public int CreateMatch(Registration registration, int roundNumber, int tournamentDivisionID, int matchNumber)
        {
            if(matchNumber % 2 != 0)
            {
                _dbContext.Add(new Match { RegistrationID1 = registration.RegistrationID, Registration1 = registration, RoundNumber = roundNumber, TournamentDivisionID = tournamentDivisionID, MatchNumber = matchNumber });
            } else
            {
                _dbContext.Add(new Match { RegistrationID2 = registration.RegistrationID, Registration2 = registration, RoundNumber = roundNumber, TournamentDivisionID = tournamentDivisionID, MatchNumber = matchNumber });
            }

             if (_dbContext.SaveChanges() > 0)
            {
                return StatusCodes.Status200OK;
            }
            else
            {
                return StatusCodes.Status304NotModified;
            }
        }

        public int CreateRegistration(Registration registration)
        {
            _dbContext.Registration.Add(registration);
            var changes = _dbContext.SaveChanges();

            if (changes > 0)
            {
                return StatusCodes.Status200OK;
            }
            else
            {
                return StatusCodes.Status500InternalServerError;
            }
        }

        public int CreateTeam(Team team)
        {
            _dbContext.Team.Add(team);
            _dbContext.SaveChanges();

            return team.TeamID;

        }

        public void CreateUserTeamStatus(UserTeamStatus uts)
        {
            _dbContext.UserTeamStatus.Add(uts);
            _dbContext.SaveChanges();
        }
        public TournamentAdmin CreateTournamentAdmin(TournamentAdmin tournamentAdmin)
        {
            _dbContext.TournamentAdmin.Add(tournamentAdmin);
            _dbContext.SaveChanges();
            return tournamentAdmin;
        }
        #endregion

        /*-------------- READ METHODS -----------------*/
        #region Read Methods
        // sort by models
        //Division
        public Division ReadDivisionByID(int DivisionID)
        {
            return _dbContext.Division.First(x => x.DivisionID == DivisionID);
        }

        public IEnumerable<Division> ReadDivisions()
        {
            return _dbContext.Division;
        }

        public IEnumerable<Division> ReadDivisionsByTournamentID(int TournamentID)
        {
            return _dbContext.TournamentDivision.Where(td => td.TournamentID == TournamentID).Select(td => td.Division);
        }

        public IEnumerable<TournamentStatus> ReadTournamentStatuses()
        {
            return _dbContext.TournamentStatus;
        }

        public TournamentStatus? ReadMinTournamentStatus()
        {
            return _dbContext.TournamentStatus
                .OrderBy(x => x.Id)
                .FirstOrDefault();
        }

        public Group ReadGroupByID(Guid GroupID)
        {
            return _dbContext.Group.First(x => x.GroupID == GroupID);
        }

        public IEnumerable<Group> ReadGroupsByTournamentDivisionID(int TournamentDivisionID)
        {
            return _dbContext.Group.Where(x => x.TournamentDivisionID == TournamentDivisionID);
        }

        public IEnumerable<Match> ReadMatchesByTournamentDivisionID(int TournamentDivisionID)
        {
            return _dbContext.Match.Where(m => m.TournamentDivisionID == TournamentDivisionID).Include(x => x.Registration1).ThenInclude(x => x.Team).Include(x => x.Registration2).ThenInclude(x => x.Team);
        }

        public IEnumerable<MatchWithRegistrationsDTO> ReadMatchesWithUsersByTournamentDivisionID(int TournamentDivisionID)
        {
            var matches = _dbContext.Match
            .Where(m => m.TournamentDivisionID == TournamentDivisionID)
            .Include(x => x.Registration1).ThenInclude(x => x.Team)
            .Include(x => x.Registration2).ThenInclude(x => x.Team)
            .ToList(); // Execute the query to materialize the results

            // Now, you can project the matches into MatchWithRegistrationsDTO
            var matchesDTO = matches.Select(match => new MatchWithRegistrationsDTO
            {
                MatchID = match.MatchID,
                RegistrationID1 = match.RegistrationID1,
                RegistrationID2 = match.RegistrationID2,
                TournamentDivisionID = match.TournamentDivisionID,
                Score1 = match.Score1,
                Score2 = match.Score2,
                MatchNumber = match.MatchNumber,
                RoundNumber = match.RoundNumber,
                // Map other properties accordingly
                Registration1 = match.Registration1 is { } ? new RegistrationWithTeamDTO
                {
                    RegistrationID = match.Registration1.RegistrationID,
                    TeamID = match.Registration1.TeamID,
                    GroupID = match.Registration1.GroupID,
                    TournamentDivisionID = match.Registration1.TournamentDivisionID,
                    PoolPlaySeed = match.Registration1.PoolPlaySeed,
                    BracketSeed = match.Registration1.BracketSeed,
                    TournamentRanking = match.Registration1.TournamentRanking,
                    CreatedAt = match.Registration1.CreatedAt,
                    UpdatedAt = match.Registration1.UpdatedAt,
                    Notes = match.Registration1.Notes,
                    Group = match.Registration1.Group,
                    TournamentDivision = match.Registration1.TournamentDivision,
                    Team = new TeamWithUsersDTO
                    {
                        TeamID = match.Registration1.Team.TeamID,
                        TeamName = match.Registration1.Team.TeamName,
                        Users = ReadUsersByTeam(match.Registration1.TeamID).ToList(),
                    }
                } : null,
                Registration2 = match.Registration2 is { } ? new RegistrationWithTeamDTO
                {
                    RegistrationID = match.Registration2.RegistrationID!,
                    TeamID = match.Registration2.TeamID,
                    GroupID = match.Registration2.GroupID,
                    TournamentDivisionID = match.Registration2.TournamentDivisionID,
                    PoolPlaySeed = match.Registration2.PoolPlaySeed,
                    BracketSeed = match.Registration2.BracketSeed,
                    TournamentRanking = match.Registration2.TournamentRanking,
                    CreatedAt = match.Registration2.CreatedAt,
                    UpdatedAt = match.Registration2.UpdatedAt,
                    Notes = match.Registration2.Notes,
                    Group = match.Registration2.Group,
                    TournamentDivision = match.Registration2.TournamentDivision,

                    Team = new TeamWithUsersDTO
                    {
                        TeamID = match.Registration2.Team.TeamID,
                        TeamName = match.Registration2.Team.TeamName,
                        Users = ReadUsersByTeam(match.Registration2.TeamID).ToList(),
                    }
                } : null,
            }); ;

            return matchesDTO;
        }

        public Match? ReadMatchByID(int matchID)
        {
            return _dbContext.Match.FirstOrDefault(m => m.MatchID == matchID);
        }

        public Registration ReadRegistrationByID(int RegistrationID)
        {
            return _dbContext.Registration.First(r => r.RegistrationID == RegistrationID);
        }

        public IEnumerable<Registration> ReadRegistrationsByGroupID(Guid GroupID)
        {
            return _dbContext.Registration.Where(r => r.GroupID == GroupID);
        }

        public List<Registration> ReadRegistrationsByTournamentDivisionID(int TournamentDivisionID)
        {
            return _dbContext.Registration.Where(r => r.TournamentDivisionID == TournamentDivisionID).Include(x => x.Team).OrderBy(x => x.BracketSeed).ToList();
        }
        public IEnumerable<Registration> ReadRegistrationsByTournamentID(int TournamentID)
        {
                return _dbContext.Registration.Where(r => r.TournamentDivision.TournamentID == TournamentID).Include(x => x.Team).Include(x => x.TournamentDivision).ThenInclude(x => x.Division).ToList();
        }

        public IEnumerable<Registration> ReadRegistrationsByUserID(string UserID)
        {
            var teams = _dbContext.UserTeamStatus.Where(u => u.UserID == UserID).Select(u => u.Team.TeamID).ToHashSet();

            return _dbContext.Registration.Where(r => teams.Contains(r.TeamID)).Include(t => t.TournamentDivision).ThenInclude(td => td.Tournament);
        }

        public Team ReadTeamByID(int TeamID)
        {
               return _dbContext.Team.First(t => t.TeamID == TeamID);
        }

        public IEnumerable<Team> ReadTeamsByUserID(string UserID)
        {
            return _dbContext.UserTeamStatus.Where(t => t.UserID == UserID).Select(t => t.Team);
        }

        public IEnumerable<TournamentAdmin> ReadTournamentAdminsByTournamentID(int TournamentID)
        {
            return _dbContext.TournamentAdmin.Where(ta => ta.TournamentID == TournamentID);
        }
        public List<Tournament> ReadTournamentsByTournamentAdminUserID(string UserID)
        {
            return _dbContext.TournamentAdmin.Where(x => x.UserID == UserID).Include(x => x.Tournament).Select(x => x.Tournament).ToList();
        }

        public Tournament ReadTournamentByID(int TournamentID)
        {
            return _dbContext.Tournament.First(t => t.TournamentID == TournamentID);
        }

        public TournamentStatus ReadTournamentStatusByID(int StatusID)
        {
            return _dbContext.TournamentStatus.FirstOrDefault(x => x.Id == StatusID)!;
        }

        public TournamentDivision ReadTournamentDivisionByID(int TournamentDivisionID)
        {
            return _dbContext.TournamentDivision.First(td => td.TournamentDivisionID == TournamentDivisionID);
        }

        public IEnumerable<TournamentDivision> ReadTournamentDivisionsByTournamentIDAndDivisionID(int TournamentID, int DivisionID)
        {
            return _dbContext.TournamentDivision.Where(td => td.TournamentID == TournamentID && td.DivisionID == DivisionID);
        }

        public IEnumerable<TournamentDivision> ReadTournamentDivisionsByTournamentID(int TournamentID)
        {
            return _dbContext.TournamentDivision.Where(td => td.TournamentID == TournamentID).Include(td => td.Division);
        }

        public IEnumerable<Tournament> ReadTournaments(double latitude, double longitude, double Distance)
        {

            CoordinateBoundaries boundaries = new CoordinateBoundaries(latitude, longitude, Distance);

            double minLatitude = boundaries.MinLatitude;
            double maxLatitude = boundaries.MaxLatitude;
            double minLongitude = boundaries.MinLongitude;
            double maxLongitude = boundaries.MaxLongitude;

            var zips = _dbContext.Zipcode.Where(z => z.Latitude >= minLatitude && z.Latitude <= maxLatitude && z.Longitude >= minLongitude && z.Longitude <= maxLongitude).Select(z => z.Zip).ToHashSet();
            return _dbContext.Tournament.Where(t => zips.Contains(t.Zipcode));
        }
        
        public IEnumerable<Tournament> ReadTournaments() //Read all tournaments
        {
            return _dbContext.Tournament;
        }

        public IEnumerable<User> ReadUserByID(string UserID)
        {
            return _dbContext.User.Where(u => u.UserID == UserID);
        }

        public IEnumerable<User> ReadUsers()
        {
            return _dbContext.User;
        }
        public IEnumerable<User> ReadUsersByTeam(int TeamID)
        {
            return _dbContext.UserTeamStatus.Where(x => x.TeamID == TeamID).Select(x => x.User);
        }

        public UserTeamStatus ReadUserTeamStatusByUserIDAndTeamID(string UserID, int TeamID)
        {
            return _dbContext.UserTeamStatus.First(uts => uts.UserID == UserID && uts.TeamID == TeamID);
        }

        /// <summary>
        /// This gives you ALL the userteamstatus objects associated with a team for the user, aka including other users on their team
        /// </summary>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public IEnumerable<UserTeamStatus> ReadUserTeamsByUserID(string UserID)
        {
            List<int> teamIDs = _dbContext.UserTeamStatus.Where(uts => uts.UserID == UserID).Select(uts => uts.TeamID).ToList();
            return _dbContext.UserTeamStatus.Where(uts => teamIDs.Contains(uts.TeamID)).Include(x => x.User).Include(x => x.Team).ToList();
        }

        public IEnumerable<UserTeamStatus> ReadUserTeamsByTeamID(int TeamID)
        {
            return _dbContext.UserTeamStatus.Where(uts => uts.TeamID == TeamID).Include(x => x.User).Include(x => x.Team).ToList();
        }
        #endregion

        /*-------------- UPDATE METHODS -----------------*/
        #region Update Methods
        // sort by models
        public void UpdateUser(User user)
        {
            User? existingUser = _dbContext.User.Find(user.UserID);
            if (existingUser != null)
            {
                _dbContext.Entry(existingUser).CurrentValues.SetValues(user);
                _dbContext.SaveChanges();
            }
        }

        public void UpdateRegistration(Registration registration)
        {
            _dbContext.Registration.Update(registration);
            _dbContext.SaveChanges();
        }

        public void UpdateRegistrationGroup(int registrationID, Guid groupId)
        {
            var registration = _dbContext.Registration.FirstOrDefault(r => r.RegistrationID == registrationID && r.GroupID != groupId);

            if (registration == null) return;
            registration.GroupID = groupId;
            _dbContext.Registration.Update(registration);
            _dbContext.SaveChanges();
        }


        public void UpdateGroupOrder(Guid groupID, int order)
        {
            var group = _dbContext.Group.FirstOrDefault(g => g.GroupID == groupID && g.Order != order);

            if (group == null) return;
            group.Order = order;
            _dbContext.Group.Update(group);
            _dbContext.SaveChanges();
        }

        public void UpdateTournament(Tournament tournament)
        {
            _dbContext.Tournament.Update(tournament);
            _dbContext.SaveChanges();
        }

        public void UpdateTeam(Team team)
        {
            Team? existingTeam = _dbContext.Team.Find(team.TeamID);
            if (existingTeam != null)
            {
                _dbContext.Entry(existingTeam).CurrentValues.SetValues(team);
                _dbContext.SaveChanges();
            }
        }

        public void UpdateUserTeamStatus(UserTeamStatus uts)
        {
            _dbContext.UserTeamStatus.Update(uts);
            _dbContext.SaveChanges();
        }
        public int UpdateMatch(Match match)
        {
            _dbContext.Match.Update(match);
            var numChanges = _dbContext.SaveChanges();

            return numChanges > 0 ? StatusCodes.Status200OK : StatusCodes.Status304NotModified;
        }
        #endregion

        /*-------------- DELETE METHODS -----------------*/
        #region Delete Methods
        // sort by models
        #endregion
        public void DeleteUserByID(string UserID)
        {
            var user = _dbContext.User.First(u => u.UserID == UserID);
            _dbContext.User.Remove(user);
            _dbContext.SaveChanges();
        }

        public void DeleteTournamentByID(int TournamentID)
        {
            var tournament = _dbContext.Tournament.First(t => t.TournamentID == TournamentID);
            _dbContext.Tournament.Remove(tournament);
            _dbContext.SaveChanges();
        }
        public void DeleteUserTeamStatusByID(int UserTeamStatusID)
        {
            var uts = _dbContext.UserTeamStatus.First(t => t.UserTeamID == UserTeamStatusID);
            _dbContext.UserTeamStatus.Remove(uts);
            _dbContext.SaveChanges();
        }
        public void DeleteGroup(Guid groupID)
        {
            var maxGroup = _dbContext.Group.First(x => x.GroupID == groupID);
            _dbContext.Group.Remove(maxGroup);
            _dbContext.SaveChanges();
        }

        public void DeleteTournamentDivision(int tournamentID, int divisionID)
        {
            var tournamentDivision = _dbContext.TournamentDivision.First(td =>
                td.TournamentID == tournamentID && td.DivisionID == divisionID);
            _dbContext.TournamentDivision.Remove(tournamentDivision);
            _dbContext.SaveChanges();
        }

        public void DeleteTournamentAdmin(int tournamentID, string userID)
        {
            var tournamentAdmin =
                _dbContext.TournamentAdmin.First(ta => ta.TournamentID == tournamentID && ta.UserID == userID);
            _dbContext.TournamentAdmin.Remove(tournamentAdmin);
            _dbContext.SaveChanges();
        }

        public int DeleteMatchByID(int matchID)
        {
            var match = _dbContext.Match.First(m => m.MatchID == matchID);
            _dbContext.Match.Remove(match);

            var numChanges = _dbContext.SaveChanges();

            if (numChanges > 0)
            {
                return StatusCodes.Status200OK;
            }
            else
            {
                return StatusCodes.Status500InternalServerError;
            }

        }
        public void DeleteRegistration(int RegID)
        {
            var registration = _dbContext.Registration.First(x => x.RegistrationID == RegID);
            _dbContext.Registration.Remove(registration);
            _dbContext.SaveChanges();
        }
    }
}

