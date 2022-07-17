using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security;
public class IsHostRequirment : IAuthorizationRequirement
{

}

public class IsHostRequirmentHandler : AuthorizationHandler<IsHostRequirment>
{
    private readonly DataContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public IsHostRequirmentHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
        _dbContext = dbContext;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirment requirement)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null) return Task.CompletedTask;

        var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value?.ToString());

        var attendee = _dbContext.ActivityAttendees
        .AsNoTracking()
        .SingleOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == activityId).Result;

        if (attendee is null) return Task.CompletedTask;

        if (attendee.IsHost) context.Succeed(requirement); // positive result flag

        return Task.CompletedTask;
    }
}