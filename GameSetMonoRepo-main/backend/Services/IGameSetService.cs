using System;
using GameSet.Models;

namespace GameSet.Services
{
	public interface IGameSetService
	{
        /*--------------- CREATE METHODS --------------*/
        #region Create Methods
        // sort by models
        public void CreateUser(User user);

        public void CreateTournament(Tournament tournament);

        #endregion

        /*-------------- READ METHODS -----------------*/
        #region Read Methods
        // User
        public User ReadUserByID(string UserID);
        public IEnumerable<User> ReadUsers();

        // Tournament
        public Tournament ReadTournamentByID(int TournamentID);
        public IEnumerable<Tournament> ReadTournaments();

        // Team
        public Team ReadTeamByID(int TeamID);
        public IEnumerable<Team> ReadTeams();

        // Registration
        public Registration ReadRegistrationByID(int RegistrationID);
        public IEnumerable<Registration> ReadRegistrationsByTournamentDivisionID(int TournamentDivisionID);
        public IEnumerable<Registration> ReadRegistrationsByGroupID(int GroupID);
        public IEnumerable<Registration> ReadRegistrationsByTournamentID(int TournamentID);

        // Match
        public IEnumerable<Match> ReadMatchesByTournamentDivisionID(int TournamentDivisionID);

        // Division
        public Division ReadDivisionByID(int DivisionID);

        // TournamentDivision
        public TournamentDivision ReadTournamentDivsionByID(int TournamentDivisionID);
        public IEnumerable<TournamentDivision> ReadTournamentDivisionsByTournamentIDAndDivisionID(int TournamentID, int DivisionID);

        // Group
        public Group ReadGroupByID(int GroupID);
        public IEnumerable<Group> ReadGroupsByTournamentDivisionID(int TournamentDivision);

        // UserTeamStatus
        public UserTeamStatus ReadUserTeamStatusByUserIDAndTeamID(string UserID, int TeamID);

        // TournamentAdmin
        public IEnumerable<TournamentAdmin> ReadTournamentAdminsByTournamentID(int TournamentID);

        #endregion

        /*-------------- UPDATE METHODS -----------------*/
        #region Update Methods
        // sort by models
        public void UpdateUser(User user);

        public void UpdateTournament(Tournament tournament);
        #endregion

        /*-------------- DELETE METHODS -----------------*/
        #region Delete Methods
        // sort by models

        public void DeleteUserByID(string UserID);

        public void DeleteTournamentByID(int TournamentID);
        #endregion

        /*-------------- MISC METHODS -----------------*/
        #region Misc Methods
        // sort by models
        #endregion
    }
}

