using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace API.Controllers;
public class ActivitiesController : BaseApiController
{
  private readonly DataContext _ctx;
  public ActivitiesController(DataContext ctx)
  {
    _ctx = ctx;
  }

  [HttpGet]
  public async Task<ActionResult<List<Activity>>> GetActivities()
  {
    var activities = await _ctx.Activities.ToListAsync();

    return Ok(activities);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<Activity>> GetActivity(Guid id)
  {
    var activity = await _ctx.Activities.FindAsync(id);
    return Ok(activity);
  }
}