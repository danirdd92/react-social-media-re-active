using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using MediatR;
using Application.Core;
using API.Extensions;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    private IMediator _madiator;
    protected IConfiguration _config;
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

    protected ActionResult HandlePagedResult<T>(Result<PagedList<T>> result)
    {
        if (result is null)
            return NotFound();
        if (result.IsSuccess && result.Value is not null)
        {
            Response.AddPaginationHeader(result.Value.CurrentPage,
                                         result.Value.PageSize,
                                         result.Value.TotalCount,
                                         result.Value.TotalPages);
            return Ok(result.Value);
        }
        if (result.IsSuccess && result.Value is null)
            return NotFound();

        return BadRequest(result.Error);
    }
}