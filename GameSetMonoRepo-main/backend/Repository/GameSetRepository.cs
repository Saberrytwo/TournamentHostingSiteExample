using System;
using GameSet.Models;

namespace GameSet.Repository
{
	public class GameSetRepository: IGameSetRepository
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

        public void CreateTournament(Tournament tournament)
        {
            _dbContext.Tournament.Add(tournament);
            _dbContext.SaveChanges();
        }
        #endregion

        /*-------------- READ METHODS -----------------*/
        #region Read Methods
        // sort by models
        public Division ReadDivisionByID(int DivisionID)
        {
            return _dbContext.Division.First(x => x.DivisionID == DivisionID);
        }

        public Group ReadGroupByID(int GroupID)
        {
            return _dbContext.Group.First(x => x.GroupID == GroupID);
        }

        public IEnumerable<Group> ReadGroupsByTournamentDivisionID(int TournamentDivisionID)
        {
            return _dbContext.Group.Where(x => x.TournamentDivisionID == TournamentDivisionID);
        }

        public IEnumerable<Match> ReadMatchesByTournamentDivisionID(int TournamentDivisionID)
        {
            return _dbContext.Match.Where(m => m.Registration1.TournamentDivisionID == TournamentDivisionID);
        }

        public Registration ReadRegistrationByID(int RegistrationID)
        {
            return _dbContext.Registration.First(r => r.RegistrationID == RegistrationID);
        }

        public IEnumerable<Registration> ReadRegistrationsByGroupID(int GroupID)
        {
            return _dbContext.Registration.Where(r => r.GroupID == GroupID);
        }

        public IEnumerable<Registration> ReadRegistrationsByTournamentDivisionID(int TournamentDivisionID)
        {
            return _dbContext.Registration.Where(r => r.TournamentDivisionID == TournamentDivisionID);
        }
        public IEnumerable<Registration> ReadRegistrationsByTournamentID(int TournamentID)
        {
            return _dbContext.Registration.Where(r => r.TournamentDivision.TournamentID == TournamentID);
        }

        public Team ReadTeamByID(int TeamID)
        {
            return _dbContext.Team.First(t => t.TeamID == TeamID);
        }

        public IEnumerable<Team> ReadTeams()
        {
            return _dbContext.Team;
        }

        public IEnumerable<TournamentAdmin> ReadTournamentAdminsByTournamentID(int TournamentID)
        {
            return _dbContext.TournamentAdmin.Where(ta => ta.TournamentID == TournamentID);
        }

        public Tournament ReadTournamentByID(int TournamentID)
        {
            return _dbContext.Tournament.First(t => t.TournamentID == TournamentID);
        }

        public TournamentDivision ReadTournamentDivisionByID(int TournamentDivisionID)
        {
            return _dbContext.TournamentDivision.First(td => td.TournamentDivisionID == TournamentDivisionID);
        }

        public IEnumerable<TournamentDivision> ReadTournamentDivisionsByTournamentIDAndDivisionID(int TournamentID, int DivisionID)
        {
            return _dbContext.TournamentDivision.Where(td => td.TournamentID == TournamentID && td.DivisionID == DivisionID);
        }

        public IEnumerable<Tournament> ReadTournaments()
        {
            return _dbContext.Tournament;
        }

        public User ReadUserByID(string UserID)
        {
            return _dbContext.User.First(u => u.UserID == UserID);
        }

        public IEnumerable<User> ReadUsers()
        {
            return _dbContext.User;
        }

        public UserTeamStatus ReadUserTeamStatusByUserIDAndTeamID(string UserID, int TeamID)
        {
            return _dbContext.UserTeamStatus.First(uts => uts.UserID == UserID && uts.TeamID == TeamID);
        }
        #endregion

        /*-------------- UPDATE METHODS -----------------*/
        #region Update Methods
        // sort by models
        public void UpdateUser(User user)
        {
            _dbContext.User.Update(user);
            _dbContext.SaveChanges();
        }

        public void UpdateTournament(Tournament tournament)
        {
            _dbContext.Tournament.Update(tournament);
            _dbContext.SaveChanges();
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

    }
}

