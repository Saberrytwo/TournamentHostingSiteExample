using System;
using System.Collections.Generic;
using GameSet.Models;
using GameSet.Models.ResponseObjects;
using GameSet.Models.RequestObjects;

namespace GameSet.Services
{
        public interface IGameSetService
        {
                /*--------------- CREATE METHODS --------------*/
                #region Create Methods
                // sort by models
                public void CreateUser(User user);

                public Tournament CreateTournament(Tournament tournament);

                public Tournament CreateTournamentAndTournamentDivisions(Tournament tournament, IEnumerable<int> divisionIdList, string userID);

                public void CreatePoolPlayMatchesForTournamentDivision(int TournamentDivisionID);

                public void CreateMatchesForGroup(Guid groupID, int roundNumber);

                public void CreateMatchesForBracket(int TournamentDivisionID);

                public int TryCreateMatch(int loserID, int winnerID, int opponentID, int roundNumber);

                public int CreateRegistration(Registration registration);
                public void CreateGroup(Guid ID, int rank, int TournamentDivisionID);
                public void CreateOrUpdateRegistrationGroup(List<Dictionary<Guid, List<int>>> GroupRegistrationList, int TournamentDivisionID);

                public int CreateTeam(Team team);

                public int InitializeBracketSeeds(int TournamentDivisionID);

                public int SetBracketSeeds(int TournamentDivisionID, List<int> RegistrationIDList);

                public void CreateUserTeamStatus(UserTeamStatus uts);
                #endregion

                /*-------------- READ METHODS -----------------*/
                #region Read Methods
                // User
                public IEnumerable<User> ReadUserByID(string UserID);
                public IEnumerable<User> ReadUsers();
                public List<User> ReadUsersByTournamentID(int TournamentID);

                // Tournament
                public Tournament ReadTournamentByID(int TournamentID);
                public List<Tournament> ReadTournamentsByTournamentAdminUserID(string UserID);
                public Tuple<Tournament, List<TournamentAdmin>, TournamentStatus, List<Division>> GetAllTournamentData(int TournamentID);
                public Tuple<List<Tournament>, List<object>> ReadTournaments(double lat, double lng, double Distance, string SearchType, string? UserID);
                // Team
                public Team ReadTeamByID(int TeamID);
                public IEnumerable<Team> ReadTeamsByUserID(string UserID);
                public Dictionary<string, List<TeamWithUsers>> ReadDivisionTeamsByTournamentID(int tournamentID);

                // Registration
                public Registration ReadRegistrationByID(int RegistrationID);
                public GroupsListRegistrationList ReadGroupsAndRegistrationsByTournamentDivisionIDByBracket(int TournamentDivisionID);
                public List<Registration> ReadRegistrationsByTournamentDivisionID(int TournamentDivisionID);
                public IEnumerable<Registration> ReadRegistrationsByGroupID(Guid GroupID);
                public IEnumerable<Registration> ReadRegistrationsByTournamentID(int TournamentID);
                public IEnumerable<Registration> ReadRegistrationsByUserID(string UserID);
                public Registration ReadRegistrationByUserIDAndTournamentID(string UserID, int TournamentID);

                // Match
                public IEnumerable<Match> ReadMatchesByTournamentDivisionID(int TournamentDivisionID);
                public IEnumerable<MatchWithRegistrationsDTO> ReadBracketMatchesByTournamentDivisionID(int TournamentDivisionID);
                public IEnumerable<Match> ReadPoolPlayMatchesByTournamentDivisionID(int TournamentDivisionID);
                public IEnumerable<MatchWithRegistrationsDTO> ReadPoolPlayMatchesWithUsersByTournamentDivisionID(int TournamentDivisionID);

                // Division
                public Division ReadDivisionByID(int DivisionID);
                public IEnumerable<Division> ReadDivisions();

                //Status
                public IEnumerable<TournamentStatus> ReadTournamentStatuses();
                public TournamentStatus? ReadMinTournamentStatus();

                // TournamentDivision
                public TournamentDivision ReadTournamentDivsionByID(int TournamentDivisionID);
                public IEnumerable<TournamentDivision> ReadTournamentDivisionsByTournamentIDAndDivisionID(int TournamentID, int DivisionID);
        public IEnumerable<TournamentDivision> ReadTournamentDivisionsByTournamentID(int TournamentID);
                public IEnumerable<Division> ReadDivisionsByTournamentID(int TournamentID);
                public GroupsListRegistrationList ReadGroupsAndRegistrationsByTournamentDivisionID(int TournamentDivisionID);

                // Group
                public Group ReadGroupByID(Guid GroupID);
                public IEnumerable<Group> ReadGroupsByTournamentDivisionID(int TournamentDivision);

                // UserTeamStatus
                public UserTeamStatus ReadUserTeamStatusByUserIDAndTeamID(string UserID, int TeamID);
                public IEnumerable<UserTeamStatus> ReadUserTeamsByUserID(string UserID);

                // TournamentAdmin
                public IEnumerable<TournamentAdmin> ReadTournamentAdminsByTournamentID(int TournamentID);

                public TeamWithUsers ReadTeamWithUsersByTeamID(int TeamID);

        #endregion

                /*-------------- UPDATE METHODS -----------------*/
        #region Update Methods
        // sort by models
        public void UpdateUser(User user);

                public void UpdateTournament(Tournament tournament);
                public void UpdateTeam(Team team);

                public void UpdateUserTeamStatus(UserTeamStatus uts);

                public int UpdateScore(int matchID, int? score1, int? score2);

                public void UpdateTournamentAndTournamentDivisions(Tournament tournament, IEnumerable<int> divisionIdList, string userID);
                #endregion

                /*-------------- SET METHODS --------------------*/
                #region  Set Methods
                public void SetGroupsAndRegistrationsForTournamentDivision(GroupRegistrationRequest groupRegistrationRequest);
                #endregion

                /*-------------- DELETE METHODS -----------------*/
                #region Delete Methods
                // sort by models

                public void DeleteUserByID(string UserID);

                public void DeleteUserTeamStatusByID(int UserTeamStatusID);
                public void DeleteTournamentDivision(int tournamentID, int divisionID);
                public void DeleteTournamentAdmin(int tournamentID, string userID);
                public void DeleteTournamentByID(int TournamentID);
                public void DeleteGroup(int TournamentDivisionID);
                public void DeleteGroup(Guid groupId);
                public void DeleteRegistrationByUserIDAndTournamentID(string UserID, int TournamentID);
                public void DeleteRegistration(int RegID);
                #endregion

        /*-------------- MISC METHODS -----------------*/

        #region Misc Methods

        // sort by models

        #endregion
        }
}