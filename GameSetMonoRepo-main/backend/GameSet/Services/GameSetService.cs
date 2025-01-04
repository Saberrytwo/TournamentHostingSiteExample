using System;
using System.Collections.Generic;
using GameSet.Models;
using GameSet.Repository;
using Microsoft.EntityFrameworkCore;
using System.Data;
using GameSet.Models.RequestObjects;
using GameSet.Models.ResponseObjects;
using System.Linq;

namespace GameSet.Services
{
    public class GameSetService : IGameSetService
    {
        private readonly IGameSetRepository _gameSetRepository;

        public GameSetService(IGameSetRepository gameSetRepository)
        {
            _gameSetRepository = gameSetRepository;
        }

        /*--------------- CREATE METHODS --------------*/
        #region Create Methods
        // sort by models
        public void CreateUser(User user)
        {
            _gameSetRepository.CreateUser(user);
        }

        public Tournament CreateTournament(Tournament tournament)
        {
            return _gameSetRepository.CreateTournament(tournament);
        }

        public void CreateGroup(Guid ID, int rank, int TournamentID)
        {
            _gameSetRepository.CreateGroup(ID, rank, TournamentID);
        }


        public Tournament CreateTournamentAndTournamentDivisions(Tournament tournament, IEnumerable<int> divisionIdList, string UserId)
        {
            tournament.TournamentStatusId = ReadMinTournamentStatus().Id;
            var createdTournament = _gameSetRepository.CreateTournament(tournament);
            _gameSetRepository.CreateTournamentAdmin(new TournamentAdmin
            { UserID = UserId.ToString(), TournamentID = tournament.TournamentID, Role = "Admin" });
            foreach (var divisionID in divisionIdList)
            {
                _gameSetRepository.CreateTournamentDivision(createdTournament.TournamentID, divisionID);
            }
            return createdTournament;
        }

        public void CreatePoolPlayMatchesForTournamentDivision(int TournamentDivisionID)
        {
            var groups = _gameSetRepository.ReadGroupsByTournamentDivisionID(TournamentDivisionID).ToList();
            var matches = _gameSetRepository.ReadMatchesByTournamentDivisionID(TournamentDivisionID).Where(x => x.RoundNumber <= 0).ToList();

            foreach (var match in matches)
            {
                _gameSetRepository.DeleteMatchByID(match.MatchID);
            }

            foreach (var group in groups)
            {
                CreateMatchesForGroup(group.GroupID);
            }

            var tournamentDivision = _gameSetRepository.ReadTournamentDivisionByID(TournamentDivisionID);
            var tournament = _gameSetRepository.ReadTournamentByID(tournamentDivision.TournamentID);
            tournament.TournamentStatusId = 30;
            _gameSetRepository.UpdateTournament(tournament);
        }

        public void CreateMatchesForGroup(Guid groupID, int roundNumber = 0)
        {
            var groupRegistrations = _gameSetRepository.ReadRegistrationsByGroupID(groupID).ToList();

            for (int i = 0; i < groupRegistrations.Count - 1; i++)
            {
                for (int j = i + 1; j < groupRegistrations.Count; j++)
                {
                    Registration registration1 = groupRegistrations[i];
                    Registration registration2 = groupRegistrations[j];

                    _gameSetRepository.CreateMatch(registration1, registration2, roundNumber, -1); // For now -1 is a placeholder. Eventually though, there will be an order of matches in Pool play too
                }
            }
        }

        public void CreateMatchesForBracket(int TournamentDivisionID)
        {
            List<Registration> tournamentDivisionRegistrations = _gameSetRepository.ReadRegistrationsByTournamentDivisionID(TournamentDivisionID).OrderBy(r => r.BracketSeed).ToList();
            var matches = _gameSetRepository.ReadMatchesByTournamentDivisionID(TournamentDivisionID).Where(x => x.RoundNumber > 0).ToList();

            foreach (var match in matches)
            {
                _gameSetRepository.DeleteMatchByID(match.MatchID);
            }
            int matchesMade = 0;
            int countTeams = tournamentDivisionRegistrations.Count;
            double roundNumber = Math.Pow(2, Math.Ceiling(Math.Log(countTeams) / Math.Log(2)));
            int firstRoundNumber = (int)roundNumber;
            int secondRoundNumber = firstRoundNumber / 2;
            int numByes = (int)roundNumber - tournamentDivisionRegistrations.Count;
            int byesCreated = 0;

            var limit = (int)(Math.Log(roundNumber, 2) + 1);
            for (int round = 1; round < limit; round++)
            {
                Console.WriteLine("Round #{0}", roundNumber);

                branch(1, 1, limit - round + 1);
                roundNumber = roundNumber / 2;
                Console.WriteLine();
            }

            void branch(int seed, int level, int limit)
            {
                var levelSum = (int)Math.Pow(2, level) + 1;

                if (limit == level + 1)
                {
                    if (roundNumber == firstRoundNumber)
                    {
                        if (levelSum - seed - 1 < countTeams)
                        {
                            _gameSetRepository.CreateMatch(tournamentDivisionRegistrations[seed - 1], tournamentDivisionRegistrations[levelSum - seed - 1], (int)roundNumber, matchesMade + 1);
                        }
                        else
                        {
                            _gameSetRepository.CreateMatch(tournamentDivisionRegistrations[seed - 1], (int)roundNumber, tournamentDivisionRegistrations[seed - 1].TournamentDivisionID, matchesMade + 1);
                        }

                    }
                    else if (roundNumber == secondRoundNumber && byesCreated < numByes && seed <= numByes)
                    {
                        if (numByes > roundNumber / 2 && (roundNumber / 2 - seed) < (numByes - (roundNumber / 2)))
                        {
                            _gameSetRepository.CreateMatch(tournamentDivisionRegistrations[seed - 1], tournamentDivisionRegistrations[levelSum - seed - 1], (int)roundNumber, matchesMade + 1);
                            byesCreated += 2;
                        }
                        else
                        {
                            _gameSetRepository.CreateMatch(tournamentDivisionRegistrations[seed - 1], (int)roundNumber, tournamentDivisionRegistrations[seed - 1].TournamentDivisionID, matchesMade + 1);
                            byesCreated++;
                        }

                    }
                    else
                    {
                        _gameSetRepository.CreateMatch((int)roundNumber, tournamentDivisionRegistrations[0].TournamentDivisionID, matchesMade + 1);
                    }

                    matchesMade++;
                    Console.WriteLine("Seed {0} vs. Seed {1}", seed, levelSum - seed);
                    return;
                }
                else if (seed % 2 == 1)
                {
                    branch(seed, level + 1, limit);
                    branch(levelSum - seed, level + 1, limit);
                }
                else
                {
                    branch(levelSum - seed, level + 1, limit);
                    branch(seed, level + 1, limit);
                }
            }
            var tournamentDivision = _gameSetRepository.ReadTournamentDivisionByID(TournamentDivisionID);
            var tournament = _gameSetRepository.ReadTournamentByID(tournamentDivision.TournamentID);
            tournament.TournamentStatusId = 40;
            _gameSetRepository.UpdateTournament(tournament);
        }

        public int TryCreateMatch(int loserID, int winnerID, int opponentID, int roundNumber)
        {
            var loser = ReadRegistrationByID(loserID);
            var winner = ReadRegistrationByID(winnerID);
            var opponent = ReadRegistrationByID(opponentID);

            if (ReadMatchByRoundAndRegistration(loser, roundNumber) is { } incorrectMatch)
            {
                if (incorrectMatch.Registration1 == loser)
                {
                    incorrectMatch.Registration1 = winner;
                    incorrectMatch.RegistrationID1 = winner.RegistrationID;
                }
                else
                {
                    incorrectMatch.Registration2 = winner;
                    incorrectMatch.RegistrationID2 = winner.RegistrationID;
                }

                return _gameSetRepository.UpdateMatch(incorrectMatch);
            }
            else
            {
                return StatusCodes.Status304NotModified;
            }
        }

        public Match ReadMatchByRoundAndRegistration(Registration registration, int roundNumber)
        {
            return ReadMatchesByTournamentDivisionID(registration.TournamentDivisionID).First(x => x.RoundNumber == roundNumber && (x.RegistrationID1 == registration.RegistrationID || x.RegistrationID2 == registration.RegistrationID));
        }

        public int CreateRegistration(Registration registration)
        {
            return _gameSetRepository.CreateRegistration(registration);
        }

        public int CreateTeam(Team team)
        {
            return _gameSetRepository.CreateTeam(team);
        }

        public void CreateUserTeamStatus(UserTeamStatus uts)
        {
            _gameSetRepository.CreateUserTeamStatus(uts);
        }
        public class SeededTeams
        {
            public int RegistrationID { get; set; }
            public int Wins { get; set; }
            public int Losses { get; set; }
            public int Ties { get; set; }
            public int PointsScored { get; set; }
            public int PointsAgainst { get; set; }
            public int PointDifference { get; set; }
            public double AvgPointDifference { get; set; }
        }
        public int InitializeBracketSeeds(int TournamentDivisionID)
        {
            var deletionStatus = DeleteOldBracketMatches(TournamentDivisionID);
            if (deletionStatus == StatusCodes.Status500InternalServerError) return deletionStatus;

            var teams = _gameSetRepository.ReadRegistrationsByTournamentDivisionID(TournamentDivisionID);

            var matches = _gameSetRepository.ReadMatchesByTournamentDivisionID(TournamentDivisionID);

            var seededBracketTeams = new Dictionary<int, SeededTeams>();

            foreach (var match in matches)
            {
                if (!seededBracketTeams.ContainsKey(match.RegistrationID1.Value)) seededBracketTeams[match.RegistrationID1.Value] = new SeededTeams();
                if (!seededBracketTeams.ContainsKey(match.RegistrationID2.Value)) seededBracketTeams[match.RegistrationID2.Value] = new SeededTeams();
                if (match.RegistrationID1.HasValue)
                {
                    seededBracketTeams[match.RegistrationID1.Value].Wins += match.Score1 > match.Score2 ? 1 : 0;
                    seededBracketTeams[match.RegistrationID1.Value].Losses += match.Score1 < match.Score2 ? 1 : 0;
                    seededBracketTeams[match.RegistrationID1.Value].Ties += match.Score1 == match.Score2 ? 1 : 0;
                    seededBracketTeams[match.RegistrationID1.Value].PointsScored += match.Score1.GetValueOrDefault();
                    seededBracketTeams[match.RegistrationID1.Value].PointsAgainst += match.Score2.GetValueOrDefault();
                    seededBracketTeams[match.RegistrationID1.Value].PointDifference += match.Score1.GetValueOrDefault() - match.Score2.GetValueOrDefault();
                    seededBracketTeams[match.RegistrationID1.Value].AvgPointDifference = seededBracketTeams[match.RegistrationID1.Value].PointDifference / (seededBracketTeams[match.RegistrationID1.Value].Wins + seededBracketTeams[match.RegistrationID1.Value].Losses + seededBracketTeams[match.RegistrationID1.Value].Ties);
                }

                if (match.RegistrationID2.HasValue)
                {
                    seededBracketTeams[match.RegistrationID2.Value].Wins += match.Score2 > match.Score1 ? 1 : 0;
                    seededBracketTeams[match.RegistrationID2.Value].Losses += match.Score2 < match.Score1 ? 1 : 0;
                    seededBracketTeams[match.RegistrationID2.Value].Ties += match.Score1 == match.Score2 ? 1 : 0;
                    seededBracketTeams[match.RegistrationID2.Value].PointsScored += match.Score2.GetValueOrDefault();
                    seededBracketTeams[match.RegistrationID2.Value].PointsAgainst += match.Score1.GetValueOrDefault();
                    seededBracketTeams[match.RegistrationID2.Value].PointDifference += match.Score2.GetValueOrDefault() - match.Score2.GetValueOrDefault();
                    seededBracketTeams[match.RegistrationID2.Value].AvgPointDifference = seededBracketTeams[match.RegistrationID2.Value].PointDifference / (seededBracketTeams[match.RegistrationID2.Value].Wins + seededBracketTeams[match.RegistrationID2.Value].Losses + seededBracketTeams[match.RegistrationID2.Value].Ties);
                }
            }

            var orderedTeams = seededBracketTeams.ToList().OrderBy(x => x.Value.Losses).ThenByDescending(x => x.Value.AvgPointDifference).ToList();

            for (var i = 0; i < orderedTeams.Count; i++)
            {
                var currentRegistration = _gameSetRepository.ReadRegistrationByID(orderedTeams[i].Key);

                currentRegistration.BracketSeed = i;
                _gameSetRepository.UpdateRegistration(currentRegistration);
            }

            return StatusCodes.Status200OK;
        }

        public int DeleteOldBracketMatches(int TournamentDivisionID)
        {
            try
            {
                var matches = _gameSetRepository.ReadMatchesByTournamentDivisionID(TournamentDivisionID).Where(x => x.RoundNumber > 0).ToList();

                foreach (var match in matches)
                {
                    _gameSetRepository.DeleteMatchByID(match.MatchID);
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"An error occurred while deleting old bracket matches: {ex}");

                // Return appropriate status code
                return StatusCodes.Status500InternalServerError;
            }

            // If no exception occurred, return success status code
            return StatusCodes.Status200OK;
        }

        public int SetBracketSeeds(int TournamentDivisionID, List<int> RegistrationIDList)
        {
            var teams = _gameSetRepository.ReadRegistrationsByTournamentDivisionID(TournamentDivisionID).ToDictionary(x => x.RegistrationID);

            if (teams.Count == 0) return StatusCodes.Status500InternalServerError;

            for (var i = 0; i < RegistrationIDList.Count; i++)
            {
                teams[RegistrationIDList[i]].BracketSeed = i;
                _gameSetRepository.UpdateRegistration(teams[RegistrationIDList[i]]);
            }

            return StatusCodes.Status200OK;
        }
        #endregion

        /*-------------- READ METHODS -----------------*/
        #region Read Methods
        // User
        public IEnumerable<User> ReadUserByID(string UserID)
        {
            return _gameSetRepository.ReadUserByID(UserID);
        }
        public IEnumerable<User> ReadUsers()
        {
            return _gameSetRepository.ReadUsers();
        }
        public List<User> ReadUsersByTournamentID(int TournamentID)
        {
            IEnumerable<Registration> registrations = ReadRegistrationsByTournamentID(TournamentID);
            List<User> users = new List<User>();
            foreach (Registration reg in registrations)
            {
                IEnumerable<User> teamUsers = _gameSetRepository.ReadUserTeamsByTeamID(reg.TeamID).Select(x => x.User);
                users.AddRange(teamUsers.ToList());
            }
            return users.GroupBy(obj => obj.UserID)
            .Select(group => group.First())
            .ToList();
        }

        // Tournament
        public Tournament ReadTournamentByID(int TournamentID)
        {
            return _gameSetRepository.ReadTournamentByID(TournamentID);
        }
        public Tuple<List<Tournament>, List<object>> ReadTournaments(double lat, double lng, double Distance, string SearchType, string? UserID)
        {
            if (SearchType == "General")
            {
                var tournaments = _gameSetRepository.ReadTournaments(lat, lng, Distance).Where(x => x.TournamentStatusId >= 20 & x.TournamentStatusId <= 40).OrderBy(x => x.StartDate.Date).ThenBy(x => x.TournamentTitle).ToList();
                var registrationsByTournament = new List<object>();
                foreach (var tournament in tournaments)
                {
                    registrationsByTournament.Add(new { Registrations = _gameSetRepository.ReadRegistrationsByTournamentID(tournament.TournamentID).ToList(), tournament.TournamentID });
                }

                return Tuple.Create(tournaments, registrationsByTournament);
            }
            else if (SearchType == "Registration")
            {
                var associatedTournaments = _gameSetRepository.ReadRegistrationsByUserID(UserID!).Select(r => r.TournamentDivision.Tournament).Distinct().Select(x => x.TournamentID).ToHashSet();
                var tournaments = _gameSetRepository.ReadTournaments().Where(x => associatedTournaments.Contains(x.TournamentID)).OrderBy(x => x.StartDate.Date).ThenBy(x => x.TournamentTitle).ToList();
                var registrationsByTournament = new List<object>();
                foreach (var tournament in tournaments)
                {
                    registrationsByTournament.Add(new { Registrations = _gameSetRepository.ReadRegistrationsByTournamentID(tournament.TournamentID).ToList(), tournament.TournamentID });
                }

                return Tuple.Create(tournaments, registrationsByTournament);
            }
            else if (SearchType == "Admin" && UserID != null)
            {
                List<Tournament> associatedTournaments = _gameSetRepository.ReadTournamentsByTournamentAdminUserID(UserID);
                var tournaments = _gameSetRepository.ReadTournaments().Where(associatedTournaments.Contains).OrderBy(x => x.StartDate.Date).ThenBy(x => x.TournamentTitle).ToList();
                var registrationsByTournament = new List<object>();
                foreach (var tournament in tournaments)
                {
                    registrationsByTournament.Add(new { Registrations = _gameSetRepository.ReadRegistrationsByTournamentID(tournament.TournamentID).ToList(), tournament.TournamentID });
                }

                return Tuple.Create(tournaments, registrationsByTournament);
            }
            else if (SearchType == "Featured")
            {
                var tournaments = new List<Tournament>();
                if (lat == 0 & lng == 0)
                {
                    tournaments = _gameSetRepository.ReadTournaments()
                        .Where(x => x.TournamentStatusId >= 20 & x.TournamentStatusId <= 40)
                        .Where(x => x.StartDate >= DateTime.Now.Date && DateTime.Now.Date <= x.EndDate)
                        .OrderByDescending(x => _gameSetRepository.ReadRegistrationsByTournamentID(x.TournamentID).Count())
                        .Take(3)
                        .ToList();
                }
                else
                {
                    tournaments = _gameSetRepository.ReadTournaments(lat, lng, Distance)
                        .Where(x => x.TournamentStatusId >= 20 & x.TournamentStatusId <= 40)
                        .Where(x => x.StartDate >= DateTime.Now.Date && DateTime.Now.Date <= x.EndDate)
                        .OrderByDescending(x => _gameSetRepository.ReadRegistrationsByTournamentID(x.TournamentID).Count())
                        .Take(3)
                        .ToList();
                }

                if (tournaments.Count < 1) //If there are no featured tournaments at user's location then get the top 3 registered tournaments in the world
                {
                    tournaments.Clear();
                    tournaments = _gameSetRepository.ReadTournaments()
                        .Where(x => x.TournamentStatusId >= 20 & x.TournamentStatusId <= 40)
                        .Where(x => x.StartDate >= DateTime.Now.Date && DateTime.Now.Date <= x.EndDate)
                        .OrderByDescending(x => _gameSetRepository.ReadRegistrationsByTournamentID(x.TournamentID).Count())
                        .Take(3)
                        .ToList();
                }

                var registrationsByTournament = new List<object>();
                foreach (var tournament in tournaments)
                {
                    registrationsByTournament.Add(new { Registrations = _gameSetRepository.ReadRegistrationsByTournamentID(tournament.TournamentID).ToList(), tournament.TournamentID });
                }

                return Tuple.Create(tournaments, registrationsByTournament);
            }
            else
            {
                var tournaments = _gameSetRepository.ReadTournaments(lat, lng, Distance).ToList();
                var registrationsByTournament = new List<object>();
                foreach (var tournament in tournaments)
                {
                    registrationsByTournament.Add(new { Registrations = _gameSetRepository.ReadRegistrationsByTournamentID(tournament.TournamentID).ToList(), tournament.TournamentID });
                }

                return Tuple.Create(tournaments, registrationsByTournament);
            }

        }
        public List<Tournament> ReadTournamentsByTournamentAdminUserID(string UserID)
        {
            return _gameSetRepository.ReadTournamentsByTournamentAdminUserID(UserID);
        }

        public Tuple<Tournament, List<TournamentAdmin>, TournamentStatus, List<Division>> GetAllTournamentData(int TournamentID)
        {
            var tournament = _gameSetRepository.ReadTournamentByID(TournamentID);
            var admins = _gameSetRepository.ReadTournamentAdminsByTournamentID(TournamentID).ToList();
            var tournamentStatus = _gameSetRepository.ReadTournamentStatusByID(tournament.TournamentStatusId);
            var tournamentDivisions = _gameSetRepository.ReadDivisionsByTournamentID(TournamentID).ToList();

            return Tuple.Create(tournament!, admins!, tournamentStatus!, tournamentDivisions!);
        }

        // Team
        public Team ReadTeamByID(int TeamID)
        {
            return _gameSetRepository.ReadTeamByID(TeamID);
        }
        public IEnumerable<Team> ReadTeamsByUserID(string UserID)
        {
            return _gameSetRepository.ReadTeamsByUserID(UserID);
        }

        public Dictionary<string, List<TeamWithUsers>> ReadDivisionTeamsByTournamentID(int tournamentID)
        {
            IEnumerable<Registration> registrations = ReadRegistrationsByTournamentID(tournamentID);
            Dictionary<string, List<TeamWithUsers>> outputDict = new Dictionary<string, List<TeamWithUsers>>();
            foreach (Registration reg in registrations)
            {
                TeamWithUsers twu = ReadTeamWithUsersByTeamID(reg.TeamID);
                if (outputDict.ContainsKey(reg.TournamentDivision.Division.DivisionName))
                {
                    outputDict[reg.TournamentDivision.Division.DivisionName].Add(twu);
                }
                else
                {
                    outputDict[reg.TournamentDivision.Division.DivisionName] = new List<TeamWithUsers> { twu };
                }
            }
            return outputDict;
        }

        public GroupsListRegistrationList ReadGroupsAndRegistrationsByTournamentDivisionIDByBracket(int TournamentDivisionID)
        {
            var tournamentDivisionGroups = _gameSetRepository.ReadGroupsByTournamentDivisionID(TournamentDivisionID);
            var tournamentDivisionRegistrations = _gameSetRepository.ReadRegistrationsByTournamentDivisionID(TournamentDivisionID).OrderBy(x => x.BracketSeed);

            return new GroupsListRegistrationList()
            { GroupList = tournamentDivisionGroups, RegistrationList = tournamentDivisionRegistrations };
        }

        // Registration
        public Registration ReadRegistrationByID(int RegistrationID)
        {
            return _gameSetRepository.ReadRegistrationByID(RegistrationID);
        }
        public List<Registration> ReadRegistrationsByTournamentDivisionID(int TournamentDivisionID)
        {
            return _gameSetRepository.ReadRegistrationsByTournamentDivisionID(TournamentDivisionID).ToList();
        }
        public IEnumerable<Registration> ReadRegistrationsByGroupID(Guid GroupID)
        {
            return _gameSetRepository.ReadRegistrationsByGroupID(GroupID);
        }
        public IEnumerable<Registration> ReadRegistrationsByTournamentID(int TournamentID)
        {
            return _gameSetRepository.ReadRegistrationsByTournamentID(TournamentID);
        }
        public IEnumerable<Registration> ReadRegistrationsByUserID(string UserID)
        {
            return _gameSetRepository.ReadRegistrationsByUserID(UserID);
        }

        public Registration ReadRegistrationByUserIDAndTournamentID(string UserID, int TournamentID)
        {
            IEnumerable<Registration> reg = ReadRegistrationsByUserID(UserID);
            return reg.Where(r => r.TournamentDivision.TournamentID == TournamentID).First();
        }

        // Match
        public IEnumerable<Match> ReadMatchesByTournamentDivisionID(int TournamentDivisionID)
        {
            return _gameSetRepository.ReadMatchesByTournamentDivisionID(TournamentDivisionID);
        }

        public IEnumerable<MatchWithRegistrationsDTO> ReadBracketMatchesByTournamentDivisionID(int TournamentDivisionID)
        {
            return _gameSetRepository.ReadMatchesWithUsersByTournamentDivisionID(TournamentDivisionID).Where(x => x.RoundNumber > 0);
        }

        public IEnumerable<Match> ReadPoolPlayMatchesByTournamentDivisionID(int TournamentDivisionID)
        {
            return _gameSetRepository.ReadMatchesByTournamentDivisionID(TournamentDivisionID).Where(x => x.RoundNumber <= 0);

        }

        public IEnumerable<MatchWithRegistrationsDTO> ReadPoolPlayMatchesWithUsersByTournamentDivisionID(int TournamentDivisionID)
        {
            return _gameSetRepository.ReadMatchesWithUsersByTournamentDivisionID(TournamentDivisionID).Where(x => x.RoundNumber <= 0);
        }

        // Division
        public Division ReadDivisionByID(int DivisionID)
        {
            return _gameSetRepository.ReadDivisionByID(DivisionID);
        }

        public IEnumerable<Division> ReadDivisions()
        {
            return _gameSetRepository.ReadDivisions();
        }

        //TournamentStatus
        public IEnumerable<TournamentStatus> ReadTournamentStatuses()
        {
            return _gameSetRepository.ReadTournamentStatuses();
        }

        public TournamentStatus? ReadMinTournamentStatus()
        {
            return _gameSetRepository.ReadMinTournamentStatus();
        }

        // TournamentDivision
        public TournamentDivision ReadTournamentDivsionByID(int TournamentDivisionID)
        {
            return _gameSetRepository.ReadTournamentDivisionByID(TournamentDivisionID);
        }
        public IEnumerable<TournamentDivision> ReadTournamentDivisionsByTournamentIDAndDivisionID(int TournamentID, int DivisionID)
        {
            return _gameSetRepository.ReadTournamentDivisionsByTournamentIDAndDivisionID(TournamentID, DivisionID);
        }

        public IEnumerable<TournamentDivision> ReadTournamentDivisionsByTournamentID(int TournamentID)
        {
            return _gameSetRepository.ReadTournamentDivisionsByTournamentID(TournamentID);
        }

        public IEnumerable<Division> ReadDivisionsByTournamentID(int TournamentID)
        {
            return _gameSetRepository.ReadDivisionsByTournamentID(TournamentID);
        }

        public GroupsListRegistrationList ReadGroupsAndRegistrationsByTournamentDivisionID(int TournamentDivisionID)
        {
            var tournamentDivisionGroups = _gameSetRepository.ReadGroupsByTournamentDivisionID(TournamentDivisionID);
            var tournamentDivisionRegistrations = _gameSetRepository.ReadRegistrationsByTournamentDivisionID(TournamentDivisionID).OrderBy(x => x.PoolPlaySeed);

            return new GroupsListRegistrationList()
            { GroupList = tournamentDivisionGroups, RegistrationList = tournamentDivisionRegistrations };
        }

        // Group
        public Group ReadGroupByID(Guid GroupID)
        {
            return _gameSetRepository.ReadGroupByID(GroupID);
        }
        public IEnumerable<Group> ReadGroupsByTournamentDivisionID(int TournamentDivision)
        {
            return _gameSetRepository.ReadGroupsByTournamentDivisionID(TournamentDivision);
        }

        // UserTeamStatus
        public UserTeamStatus ReadUserTeamStatusByUserIDAndTeamID(string UserID, int TeamID)
        {
            return _gameSetRepository.ReadUserTeamStatusByUserIDAndTeamID(UserID, TeamID);
        }
        public IEnumerable<UserTeamStatus> ReadUserTeamsByUserID(string UserID)
        {
            return _gameSetRepository.ReadUserTeamsByUserID(UserID);
        }

        // TournamentAdmin
        public IEnumerable<TournamentAdmin> ReadTournamentAdminsByTournamentID(int TournamentID)
        {
            return _gameSetRepository.ReadTournamentAdminsByTournamentID(TournamentID);
        }

        public TeamWithUsers ReadTeamWithUsersByTeamID(int TeamID)
        {
            Team team = _gameSetRepository.ReadTeamByID(TeamID);
            List<UserTeamStatus> uts = _gameSetRepository.ReadUserTeamsByTeamID(TeamID).ToList();
            List<User> users = uts.Select(u => u.User).ToList();
            TeamWithUsers twu = new TeamWithUsers
            {
                Team = team,
                Users = users,
                UserTeamStatuses = uts
            };
            return twu;
        }

        #endregion

        /*-------------- UPDATE METHODS -----------------*/
        #region Update Methods
        // sort by models
        public void UpdateUser(User user)
        {
            _gameSetRepository.UpdateUser(user);
        }

        public void UpdateTournament(Tournament tournament)
        {
            _gameSetRepository.UpdateTournament(tournament);
        }

        public void UpdateTeam(Team team)
        {
            _gameSetRepository.UpdateTeam(team);
        }

        public void UpdateUserTeamStatus(UserTeamStatus uts)
        {
            _gameSetRepository.UpdateUserTeamStatus(uts);
        }

        public void UpdateTournamentAndTournamentDivisions(Tournament tournament, IEnumerable<int> divisionIdList, string userID)
        {
            //No Auth Yet
            // // Step 1: Verify admin status
            // var admins = _gameSetRepository.ReadTournamentAdminsByTournamentID(tournament.TournamentID);
            // if (!admins.Any(a => a.UserID == userID))
            // {
            //     throw new UnauthorizedAccessException("User is not authorized to update this tournament.");
            // }

            // Step 2: Update the tournament details
            // var currentTournament = _gameSetRepository.ReadTournamentByID(tournament.TournamentID);
            // if (currentTournament != null)
            // {
            //     if (currentTournament.TournamentStatusId < 10)
            //     {
            //         tournament.TournamentStatusId = 10;
            //     }
            //     else
            //     {
            //         tournament.TournamentStatusId = currentTournament.TournamentStatusId;
            //     }
            // }

            if (tournament.TournamentStatusId < 10)
            {
                tournament.TournamentStatusId = 10;
            }

            _gameSetRepository.UpdateTournament(tournament);

            // Step 3: Retrieve current divisions and determine changes
            var currentDivisionIds = _gameSetRepository.ReadDivisionsByTournamentID(tournament.TournamentID)
                .Select(d => d.DivisionID);

            var currentDivisionIdList = currentDivisionIds.ToList();
            var newDivisionIdList = divisionIdList.ToList();
            var divisionsToRemove = currentDivisionIdList.Except(newDivisionIdList);
            var divisionsToAdd = newDivisionIdList.Except(currentDivisionIdList);

            // Step 4: Remove divisions that are no longer needed
            foreach (var divisionID in divisionsToRemove)
            {
                _gameSetRepository.DeleteTournamentDivision(tournament.TournamentID, divisionID);
            }

            // Step 5: Add new divisions
            foreach (var divisionID in divisionsToAdd)
            {
                _gameSetRepository.CreateTournamentDivision(tournament.TournamentID, divisionID);
            }
        }


        public int UpdateScore(int matchID, int? score1, int? score2)
        {
            var match = _gameSetRepository.ReadMatchByID(matchID);

            if (match is { })
            {
                match.Score1 = score1;
                match.Score2 = score2;
                var winner = match.Score1 > match.Score2 ? match.RegistrationID1 : match.Score2 > match.Score1 ? match.RegistrationID2 : null;
                var scoreUpdates = _gameSetRepository.UpdateMatch(match);

                if (match.RoundNumber > 0 && match.RoundNumber != 2)
                {
                    var matchesInRound = _gameSetRepository.ReadMatchesByTournamentDivisionID(match.TournamentDivisionID).Where(x => x.RoundNumber == match.RoundNumber).ToList();

                    double nextMatchNumber = match.MatchNumber + (match.RoundNumber / 2) - Math.Floor((double)((matchesInRound.IndexOf(match) + 1) / 2));

                    Match? nextMatch = _gameSetRepository.ReadMatchesByTournamentDivisionID(match.TournamentDivisionID).First(x => x.MatchNumber == nextMatchNumber);

                    if (match.MatchNumber % 2 != 0)
                    {
                        nextMatch.RegistrationID1 = winner;
                    }
                    else
                    {
                        nextMatch.RegistrationID2 = winner;
                    }
                    return scoreUpdates + _gameSetRepository.UpdateMatch(nextMatch);
                }
                return scoreUpdates;

            }
            Console.Write("You tried to update a score for a match that doesn't currently exist...This shouldn't be possible");
            return StatusCodes.Status400BadRequest;
        }

        public void CreateOrUpdateRegistrationGroup(List<Dictionary<Guid, List<int>>> GroupRegistrationList, int TournamentDivisionID)
        {
            var groupIDs = _gameSetRepository.ReadGroupsByTournamentDivisionID(TournamentDivisionID).Select(x => x.GroupID).ToHashSet<Guid>();
            for (var i = 0; i < GroupRegistrationList.Count(); i++)
            {


                if (!groupIDs.Contains(GroupRegistrationList[i].Keys.First()))
                {
                    if (GroupRegistrationList[i].Keys.First() != new Guid("00000000-0000-0000-0000-000000000000"))
                    {
                        var newGroup = new Group
                        {
                            GroupID = GroupRegistrationList[i].Keys.First(),
                            Order = i,
                            TournamentDivisionID = TournamentDivisionID
                        };
                        _gameSetRepository.CreateGroup(newGroup);
                    }
                }

                for (var j = 0; j < GroupRegistrationList[i].Values.First().Count(); j++)
                {
                    var id = GroupRegistrationList[i].Values.First()[j];
                    var currentRegistration = _gameSetRepository.ReadRegistrationByID(id);
                    if (GroupRegistrationList[i].Keys.First() == new Guid("00000000-0000-0000-0000-000000000000"))
                    {
                        currentRegistration.GroupID = null;
                    }
                    else
                    {
                        currentRegistration.GroupID = GroupRegistrationList[i].Keys.First();
                        currentRegistration.PoolPlaySeed = j;
                    }

                    _gameSetRepository.UpdateRegistration(currentRegistration);
                }
            }

            var objectIds = GroupRegistrationList.SelectMany(x => x.Keys).ToHashSet();
            var missingIds = groupIDs.Where(id => !objectIds.Contains(id)).ToHashSet();

            foreach (var item in missingIds)
            {
                _gameSetRepository.DeleteGroup(item);
            }
        }
        #endregion

        /*-------------- SET METHODS --------------------*/
        #region  Set Methods

        public void SetGroupsAndRegistrationsForTournamentDivision(GroupRegistrationRequest groupRegistrationRequest)
        {
            // Get current groups for division
            var currentGroups =
                _gameSetRepository.ReadGroupsByTournamentDivisionID(groupRegistrationRequest.TournamentDivisionID);

            // Identify groups to delete
            var enumerable = currentGroups.ToList();
            var groupsToDelete = enumerable.Where(g => !groupRegistrationRequest.GroupList.Contains(g.GroupID)).ToList();

            // Delete groups not in the new list
            foreach (var group in groupsToDelete)
            {
                DeleteGroup(group.GroupID);
            }

            // Update or add new groups and set their order
            foreach (var groupId in groupRegistrationRequest.GroupList.Select((value, index) => new { value, index }))
            {
                var group = enumerable.FirstOrDefault(g => g.GroupID == groupId.value);
                if (group == null)
                {
                    var newGroup = new Group()
                    {
                        GroupID = groupId.value,
                        Order = groupId.index + 1,
                        TournamentDivisionID = groupRegistrationRequest.TournamentDivisionID
                    };
                    _gameSetRepository.CreateGroup(newGroup);
                }
                else if (enumerable.FirstOrDefault(g => g.GroupID == groupId.value)!.Order != (groupId.index + 1))
                {
                    _gameSetRepository.UpdateGroupOrder(groupId.value, (groupId.index + 1));
                }
            }

            // Update registrations
            foreach (var groupID in groupRegistrationRequest.RegistrationIDsPerGroup)
            {
                foreach (var registrationId in groupID.Value)
                {
                    var registration = _gameSetRepository.ReadRegistrationByID(registrationId);
                    var update = false;
                    if (groupID.Key == new Guid())
                    {
                        registration.GroupID = null;
                        update = true;
                    }
                    else if (registration.GroupID != groupID.Key)
                    {
                        registration.GroupID = groupID.Key;
                        update = true;
                    }

                    if (update)
                    {
                        _gameSetRepository.UpdateRegistration(registration);
                    }
                }
            }
        }

        #endregion

        /*-------------- DELETE METHODS -----------------*/
        #region Delete Methods
        // sort by models
        public void DeleteUserByID(string UserID)
        {
            _gameSetRepository.DeleteUserByID(UserID);
        }

        public void DeleteTournamentByID(int TournamentID)
        {
            _gameSetRepository.DeleteTournamentByID(TournamentID);
        }

        public void DeleteUserTeamStatusByID(int UserTeamStatusID)
        {
            _gameSetRepository.DeleteUserTeamStatusByID(UserTeamStatusID);
        }

        public void DeleteGroup(int TournamentDivisionID)
        {
            var TournamentDivision = _gameSetRepository.ReadTournamentDivisionByID(TournamentDivisionID);
            var group = _gameSetRepository.ReadGroupsByTournamentDivisionID(TournamentDivisionID).OrderByDescending(x => x.Order).FirstOrDefault();
            if (group != null)
            {
                var registrations = _gameSetRepository.ReadRegistrationsByGroupID(group.GroupID).ToList();

                registrations.ForEach(x =>
                {
                    x.GroupID = null;
                    _gameSetRepository.UpdateRegistration(x);
                });
                _gameSetRepository.DeleteGroup(group.GroupID);
            }
        }

        public void DeleteGroup(Guid groupID)
        {
            var group = _gameSetRepository.ReadGroupByID(groupID);
            var registrations = _gameSetRepository.ReadRegistrationsByGroupID(group.GroupID).ToList();

            registrations.ForEach(x =>
            {
                x.GroupID = null;
                _gameSetRepository.UpdateRegistration(x);
            });
            _gameSetRepository.DeleteGroup(group.GroupID);
        }

        public void DeleteTournamentDivision(int tournamentID, int divisionID)
        {
            _gameSetRepository.DeleteTournamentDivision(tournamentID, divisionID);
        }

        public void DeleteTournamentAdmin(int tournamentID, string userID)
        {
            _gameSetRepository.DeleteTournamentAdmin(tournamentID, userID);
        }

        public void DeleteRegistrationByUserIDAndTournamentID(string UserID, int TournamentID)
        {
            Registration r = ReadRegistrationByUserIDAndTournamentID(UserID, TournamentID);
            DeleteRegistration(r.RegistrationID);

        }
        public void DeleteRegistration(int RegID)
        {
            _gameSetRepository.DeleteRegistration(RegID);
        }

        #endregion

        /*-------------- MISC METHODS -----------------*/
        #region Misc Methods
        // sort by models
        #endregion
    }
}

