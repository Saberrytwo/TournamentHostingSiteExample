using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using GameSet.Models;
using Microsoft.AspNetCore.Authorization;
using GameSet.Services;
using Microsoft.Extensions.Options;
using static GameSet.Controllers.TeamController;

namespace GameSet.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        private readonly IGameSetService _gameSetService;

        public UserController(IGameSetService gameSetService)
        {
            _gameSetService = gameSetService;
        }

        //[Authorize]
        [HttpGet("GetUsers")]
        public IEnumerable<User> GetUsers()
        {
            return _gameSetService.ReadUsers();
        }

        [HttpGet("GetUserByID")]
        public IEnumerable<User> GetUserByID(string UserId)
        {
            return _gameSetService.ReadUserByID(UserId);
        }

        [HttpDelete("DeleteUser")]
        public void DeleteUser(string UserId)
        {
            _gameSetService.DeleteUserByID(UserId);
        }

        [HttpPost("CreateUser")]
        public void CreateUser(User user)
        {
            _gameSetService.CreateUser(user);
        }

        public class UserModel
        {
            public User User { get; set; }
        }
        [HttpPost("UpdateUser")]
        public void UpdateUser([FromBody] UserModel model)
        {
            _gameSetService.UpdateUser(model.User);
        }
    }
}


