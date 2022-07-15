using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using MediatR;
using Application.Core;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    private IMediator _madiator;

    protected IMediator Mediator => _madiator ??= HttpContext.RequestServices.GetService<IMediator>();

    protected ActionResult HandleResult<T>(Result<T> result)
    {
        if (result is null)
            return NotFound();
        if (result.IsSuccess && result.Value is not null)
            return Ok(result.Value);
        if (result.IsSuccess && result.Value is null)
            return NotFound();

        return BadRequest(result.Error);
    }
}