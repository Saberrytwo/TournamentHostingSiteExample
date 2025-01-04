using System;
using GameSet.Models;
namespace GameSet.Repository
{
	public interface IGameSetRepository
	{
        /*--------------- CREATE METHODS --------------*/
        #region Create Methods
        // sort by models
        public void CreateUser(User user);
        public void CreateTournament(Tournament tournament);

        #endregion

        /*-------------- READ METHODS -----------------*/
        #region Read Methods

        // User Methods
        public User ReadUserByID(string UserID);
        public IEnumerable<User> ReadUsers();

        // Tournament Methods
        public Tournament ReadTournamentByID(int TournamentID);
        public IEnumerable<Tournament> ReadTournaments();

        // Team Methods
        public Team ReadTeamByID(int TeamID);
        public IEnumerable<Team> ReadTeams();

        // Registration Methods
        public Registration ReadRegistrationByID(int RegistrationID);
        public IEnumerable<Registration> ReadRegistrationsByTournamentDivisionID(int TournamentDivisionID);
        public IEnumerable<Registration> ReadRegistrationsByGroupID(int GroupID);
        public IEnumerable<Registration> ReadRegistrationsByTournamentID(int TournamentID);

        // Match Methods
        public IEnumerable<Match> ReadMatchesByTournamentDivisionID(int TournamentDivisionID);

        // Division Methods
        public Division ReadDivisionByID(int DivisionID);

        // Tournament Division Methods
        public TournamentDivision ReadTournamentDivisionByID(int TournamentDivisionID);
        public IEnumerable<TournamentDivision> ReadTournamentDivisionsByTournamentIDAndDivisionID(int TournamentID, int DivisionID);

        // Group Methods
        public Group ReadGroupByID(int GroupID);
        public IEnumerable<Group> ReadGroupsByTournamentDivisionID(int TournamentDivisionID);

        // UserTeamStatus Methods
        public UserTeamStatus ReadUserTeamStatusByUserIDAndTeamID(string UserID, int TeamID);

        // TournamentAdmins
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
        public void DeleteUserByID(string userID);

        public void DeleteTournamentByID(int tournamentID);
        #endregion

    }
}

