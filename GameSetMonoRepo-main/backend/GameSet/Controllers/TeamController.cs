using System;
using GameSet.Models;
using GameSet.Services;
using Microsoft.AspNetCore.Mvc;


namespace GameSet.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TeamController
    {
        private readonly IGameSetService _gameSetService;

        public TeamController(IGameSetService gameSetService)
        {
            _gameSetService = gameSetService;
        }

        [HttpGet("GetTeamsByUserId")]
        public IEnumerable<Team> ListTeams(string UserID)
        {
            return _gameSetService.ReadTeamsByUserID(UserID);
        }

        [HttpGet("GetUserTeamsByUserId")]
        public IEnumerable<UserTeamStatus> GetUserTeams(string UserID)
        {
            return _gameSetService.ReadUserTeamsByUserID(UserID);
        }

        [HttpGet("GetTeamByTeamID")]
        public TeamWithUsers GetTeamByTeamID(int TeamID)
        {
            return _gameSetService.ReadTeamWithUsersByTeamID(TeamID);
        }

        public class CreateTeamModel
        {
            public Team Team { get; set; }
            public string? UserID { get; set; }
            public List<string> UserIDs { get; set; }
        }

        [HttpPost("CreateTeam")]
        public void CreateTeam([FromBody] CreateTeamModel model)
        {
            // first create the team
            int teamID = _gameSetService.CreateTeam(model.Team);
            // second create the first user in the user team status table
            UserTeamStatus uts = new UserTeamStatus
            {
                UserID = model.UserID,
                TeamID = teamID,
                Status = "Owner"
            };

            _gameSetService.CreateUserTeamStatus(uts);

            // all the other players
            foreach (string user in model.UserIDs)
            {
                UserTeamStatus ust = new UserTeamStatus
                {
                    UserID = user,
                    TeamID = teamID,
                    Status = "Active"
                };

                _gameSetService.CreateUserTeamStatus(ust);
            }

        }

        [HttpPost("UpdateTeam")]
        public void UpdateTeam([FromBody] CreateTeamModel model)
        {
            // first create the team
            _gameSetService.UpdateTeam(model.Team);

            // do big comparison on which users we have
            TeamWithUsers twu = _gameSetService.ReadTeamWithUsersByTeamID(model.Team.TeamID);
            foreach (UserTeamStatus uts in twu.UserTeamStatuses)
            {
                // if we removed a user, remove them in the db
                if (!model.UserIDs.Contains(uts.UserID) && uts.Status != "Owner")
                {
                    _gameSetService.DeleteUserTeamStatusByID(uts.UserTeamID);
                }
            }

            List<string> existingUserIDs = twu.UserTeamStatuses.Select(x => x.User.UserID).ToList();
            // all the other players
            foreach (string user in model.UserIDs)
            {
                if (!existingUserIDs.Contains(user))
                {
                    UserTeamStatus ust = new UserTeamStatus
                    {
                        UserID = user,
                        TeamID = model.Team.TeamID,
                        Status = "Active"
                    };

                    _gameSetService.CreateUserTeamStatus(ust);
                }
            }

        }



        [HttpPost("AddUserToTeam")]
        public void AddUserToTeam(int TeamID, string UserID)
        {
            // second create the first user in the user team status table
            UserTeamStatus uts = new UserTeamStatus
            {
                UserID = UserID,
                TeamID = TeamID,
                Status = "Owner"
            };

            _gameSetService.CreateUserTeamStatus(uts);

        }
    }
}

