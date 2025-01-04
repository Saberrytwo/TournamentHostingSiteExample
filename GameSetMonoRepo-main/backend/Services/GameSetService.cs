using System;
using GameSet.Models;
using GameSet.Repository;

namespace GameSet.Services
{
	public class GameSetService: IGameSetService
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

        public void CreateTournament(Tournament tournament)
        {
            _gameSetRepository.CreateTournament(tournament);
        }
        #endregion

        /*-------------- READ METHODS -----------------*/
        #region Read Methods
        // User
        public User ReadUserByID(string UserID)
        {
            return _gameSetRepository.ReadUserByID(UserID);
        }
        public IEnumerable<User> ReadUsers()
        {
            return _gameSetRepository.ReadUsers();
        }

        // Tournament
        public Tournament ReadTournamentByID(int TournamentID)
        {
            return _gameSetRepository.ReadTournamentByID(TournamentID);
        }
        public IEnumerable<Tournament> ReadTournaments()
        {
            return _gameSetRepository.ReadTournaments();
        }

        // Team
        public Team ReadTeamByID(int TeamID)
        {
            return _gameSetRepository.ReadTeamByID(TeamID);
        }
        public IEnumerable<Team> ReadTeams()
        {
            return _gameSetRepository.ReadTeams();
        }

        // Registration
        public Registration ReadRegistrationByID(int RegistrationID)
        {
            return _gameSetRepository.ReadRegistrationByID(RegistrationID);
        }
        public IEnumerable<Registration> ReadRegistrationsByTournamentDivisionID(int TournamentDivisionID)
        {
            return _gameSetRepository.ReadRegistrationsByTournamentDivisionID(TournamentDivisionID);
        }
        public IEnumerable<Registration> ReadRegistrationsByGroupID(int GroupID)
        {
            return _gameSetRepository.ReadRegistrationsByGroupID(GroupID);
        }
        public IEnumerable<Registration> ReadRegistrationsByTournamentID(int TournamentID)
        {
            return _gameSetRepository.ReadRegistrationsByTournamentID(TournamentID);
        }

        // Match
        public IEnumerable<Match> ReadMatchesByTournamentDivisionID(int TournamentDivisionID)
        {
            return _gameSetRepository.ReadMatchesByTournamentDivisionID(TournamentDivisionID);
        }

        // Division
        public Division ReadDivisionByID(int DivisionID)
        {
            return _gameSetRepository.ReadDivisionByID(DivisionID);
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

        // Group
        public Group ReadGroupByID(int GroupID)
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

        // TournamentAdmin
        public IEnumerable<TournamentAdmin> ReadTournamentAdminsByTournamentID(int TournamentID)
        {
            return _gameSetRepository.ReadTournamentAdminsByTournamentID(TournamentID);
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
        #endregion

        /*-------------- MISC METHODS -----------------*/
        #region Misc Methods
        // sort by models
        #endregion
    }
}

