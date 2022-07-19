using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        [HttpGet("{userName}")]
        public async Task<IActionResult> GetFollowing(string userName, string predicate)
        {
            var result = await Mediator.Send(new List.Query { UserName = userName, Predicate = predicate });
            return HandleResult(result);
        }


        [HttpPost("{userName}")]
        public async Task<IActionResult> Follow(string userName)
        {
            var result = await Mediator.Send(new FollowToggle.Command { TargetUserName = userName });

            return HandleResult(result);
        }


    }
}