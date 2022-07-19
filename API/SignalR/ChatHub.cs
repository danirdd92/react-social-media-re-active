
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;
public class ChatHub : Hub
{
    private readonly IMediator _mediator;

    public ChatHub(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task SendComment(Create.Command command)
    {
        var comment = await _mediator.Send(command);

        await Clients.Group(command.ActivityId.ToString())
                    .SendAsync("RecieveComment", comment.Value);
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        //get the activityId as string
        var activityId = httpContext.Request.Query["activityId"];

        //sub the client into a group based on the activityId
        await Groups.AddToGroupAsync(Context.ConnectionId, activityId);

        //query all comments for given activityId
        var result = await _mediator.Send(new List.Query { ActivityId = Guid.Parse(activityId) });

        //send comments to the caller
        await Clients.Caller.SendAsync("LoadComments", result.Value);
    }
}