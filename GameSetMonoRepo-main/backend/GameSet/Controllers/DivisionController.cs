using GameSet.Models;
using GameSet.Services;
using Microsoft.AspNetCore.Mvc;

namespace GameSet.Controllers;


[ApiController]
[Route("[controller]")]
public class DivisionController : Controller
{
    private readonly IGameSetService _gameSetService;

    public DivisionController(IGameSetService gameSetService)
    {
        _gameSetService = gameSetService;
    }
    
    //[Authorize]
    [HttpGet("GetDivisions")]
    public IEnumerable<Division> GetDivisions()
    {
        return _gameSetService.ReadDivisions();
    }
}