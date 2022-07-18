using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Activities;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
public class ActivitiesController : BaseApiController
{


    [HttpGet]
    public async Task<IActionResult> GetActivities()
    {
        var activities = await Mediator.Send(new List.Query());

        return HandleResult(activities);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetActivity(Guid id)
    {
        var result = await Mediator.Send(new Details.Query { Id = id });

        return HandleResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateActivity([FromBody] Activity activity)
    {
        var result = await Mediator.Send(new Create.Command { Activity = activity });
        return HandleResult(result);
    }

    [HttpPost("{id}/attend")]
    public async Task<IActionResult> Attend(Guid id)
    {
        var result = await Mediator.Send(new UpdateAttendance.Command { Id = id });
        return HandleResult(result);
    }

    [Authorize(Policy = "IsActivityHost")]
    [HttpPut("{id}/attend")]
    public async Task<IActionResult> EditActivity(Guid id, Activity activity)
    {
        activity.Id = id;
        var result = await Mediator.Send(new Edit.Command { Activity = activity });
        return HandleResult(result);
    }

    [Authorize(Policy = "IsActivityHost")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteActivity(Guid id)
    {
        var result = await Mediator.Send(new Delete.Command { Id = id });

        return HandleResult(result);
    }
}