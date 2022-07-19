using Application.Core;
using MediatR;

namespace Application.Followers;

public class FoolowToggle
{
    public class Command : IRequest<Result<Unit>>
    {
        public string TargetUserName { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        public Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}