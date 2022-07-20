using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
public class ProfilesController : BaseApiController
{
    [HttpGet("{userName}")]
    public async Task<IActionResult> GetProfile(string userName)
    {
        var result = await Mediator.Send(new Details.Query { UserName = userName });
        return HandleResult(result);
    }

    [HttpGet("{userName}/activities")]
    public async Task<IActionResult> GetUserActivities(string userName, string predicate)
    {
        var result = await Mediator.Send(new ListActivities.Query { UserName = userName, Predicate = predicate });
        return HandleResult(result);
    }

    [HttpPut]
    public async Task<IActionResult> Edit(Edit.Command command)
    {
        var result = await Mediator.Send(command);

        return HandleResult(result);
    }
}