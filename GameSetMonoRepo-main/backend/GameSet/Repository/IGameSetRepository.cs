using System;
using System.Collections.Generic;
using GameSet.Models;
using GameSet.Models.ResponseObjects;
namespace GameSet.Repository
{
        public interface IGameSetRepository
        {
                /*--------------- CREATE METHODS --------------*/
                #region Create Methods
                // sort by models
                public void CreateUser(User user);

                public Tournament CreateTournament(Tournament tournament);

                public void CreateGroup(Guid ID, int rank, int TournamentID);

                public int CreateMatch(Registration registration1, Registration registration2, int roundNumber, int matchNumber);
                public int CreateMatch(Registration registration1, int roundNumber, int tournamentDivisionID, int matchNumber);
                public int CreateMatch(int roundNumber, int tournamentDivisionID, int matchNumber);

                public void CreateGroup(Group group);

                public int CreateRegistration(Registration registration);

                public void CreateTournamentDivision(int tournamentID, int divisionID);

                public int CreateTeam(Team team);

                public void CreateUserTeamStatus(UserTeamStatus uts);

                public TournamentAdmin CreateTournamentAdmin(TournamentAdmin tournamentAdmin);

                #endregion

                /*-------------- READ METHODS -----------------*/
                #region Read Methods


                // User Methods
                public IEnumerable<User> ReadUserByID(string UserID);
                public IEnumerable<User> ReadUsers();

                // Tournament Methods
                public Tournament ReadTournamentByID(int TournamentID);
                public List<Tournament> ReadTournamentsByTournamentAdminUserID(string UserID);
                public IEnumerable<Tournament> ReadTournaments(double latitude, double longitude, double distance);
                public IEnumerable<Tournament> ReadTournaments();

                // Tournament Status Methods
                public TournamentStatus ReadTournamentStatusByID(int TournamentID);

                // Team Methods
                public Team ReadTeamByID(int TeamID);
                public IEnumerable<Team> ReadTeamsByUserID(string UserID);

                // Registration Methods
                public Registration ReadRegistrationByID(int RegistrationID);
                public List<Registration> ReadRegistrationsByTournamentDivisionID(int TournamentDivisionID);
                public IEnumerable<Registration> ReadRegistrationsByGroupID(Guid GroupID);
                public IEnumerable<Registration> ReadRegistrationsByTournamentID(int TournamentID);
                public IEnumerable<Registration> ReadRegistrationsByUserID(string UserID);

                // Match Methods
                public IEnumerable<Match> ReadMatchesByTournamentDivisionID(int TournamentDivisionID);
        public IEnumerable<MatchWithRegistrationsDTO> ReadMatchesWithUsersByTournamentDivisionID(int TournamentDivisionID);
                public Match? ReadMatchByID(int matchID);

                // Division Methods
                public Division ReadDivisionByID(int DivisionID);
                public IEnumerable<Division> ReadDivisions();

                // Tournament Division Methods
                public TournamentDivision ReadTournamentDivisionByID(int TournamentDivisionID);
                public IEnumerable<TournamentDivision> ReadTournamentDivisionsByTournamentIDAndDivisionID(int TournamentID, int DivisionID);
                public IEnumerable<TournamentDivision> ReadTournamentDivisionsByTournamentID(int TournamentID);
                public IEnumerable<Division> ReadDivisionsByTournamentID(int TournamentID);

                // Read Tournament Statuses
                public IEnumerable<TournamentStatus> ReadTournamentStatuses();
                public TournamentStatus? ReadMinTournamentStatus();

                // Group Methods
                public Group ReadGroupByID(Guid GroupID);
                public IEnumerable<Group> ReadGroupsByTournamentDivisionID(int TournamentDivisionID);

                // UserTeamStatus Methods
                public UserTeamStatus ReadUserTeamStatusByUserIDAndTeamID(string UserID, int TeamID);
                public IEnumerable<UserTeamStatus> ReadUserTeamsByUserID(string UserID);
                public IEnumerable<UserTeamStatus> ReadUserTeamsByTeamID(int TeamID);

                // TournamentAdmins
                public IEnumerable<TournamentAdmin> ReadTournamentAdminsByTournamentID(int TournamentID);



                #endregion

                /*-------------- UPDATE METHODS -----------------*/
                #region Update Methods
                // sort by models
                public void UpdateUser(User user);

                public void UpdateTournament(Tournament tournament);
                public void UpdateRegistration(Registration registration);
                public void UpdateRegistrationGroup(int registrationID, Guid groupId);
                public void UpdateGroupOrder(Guid groupID, int order);
                public void UpdateTeam(Team team);
                public void UpdateUserTeamStatus(UserTeamStatus uts);
                public int UpdateMatch(Match match);

                #endregion

                /*-------------- DELETE METHODS -----------------*/
                #region Delete Methods
                // sort by models
                public void DeleteUserByID(string userID);

                public void DeleteTournamentByID(int tournamentID);

                public void DeleteUserTeamStatusByID(int UserTeamStatusID);
                public void DeleteTournamentDivision(int tournamentID, int divisionID);
                public void DeleteTournamentAdmin(int tournamentID, string userID);
                public int DeleteMatchByID(int matchID);
                public void DeleteGroup(Guid groupID);
                public void DeleteRegistration(int RegID);

                #endregion

        }
}

