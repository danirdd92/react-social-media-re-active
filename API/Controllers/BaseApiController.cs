using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using MediatR;
namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    private IMediator _madiator;

    protected IMediator Mediator => _madiator ??= HttpContext.RequestServices.GetService<IMediator>();
}