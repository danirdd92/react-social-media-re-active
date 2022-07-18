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

    [HttpPut]
    public async Task<IActionResult> Edit(Edit.Command command)
    {
        var result = await Mediator.Send(command);

        return HandleResult(result);
    }
}