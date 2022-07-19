using Application.Contracts;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers;

public class FollowToggle
{
    public class Command : IRequest<Result<Unit>>
    {
        public string TargetUserName { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }



        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var observer = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName(), cancellationToken: cancellationToken);

            if (observer is null) return null;

            var target = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUserName, cancellationToken: cancellationToken);

            if (target is null) return null;

            var following = await _context.UserFollowings.FindAsync(new object[] { observer.Id, target.Id }, cancellationToken: cancellationToken);

            if (following is null)
            {
                following = new UserFollowing()
                {
                    Observer = observer,
                    Target = target
                };

                _context.UserFollowings.Add(following);
            }
            else
            {
                _context.UserFollowings.Remove(following);
            }

            var success = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!success) return Result<Unit>.Failure("Problem updating following");

            return Result<Unit>.Success(Unit.Value);
        }


    }
}