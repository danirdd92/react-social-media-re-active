
using P = Application.Profiles.Profile;
using AutoMapper;
using MediatR;
using Persistence;
using Application.Contracts;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Application.Core;

namespace Application.Followers;

public class List
{
    public class Query : IRequest<Result<List<P>>>
    {
        public string Predicate { get; set; }
        public string UserName { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<P>>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
        {
            _context = context;
            _mapper = mapper;
            _userAccessor = userAccessor;
        }

        public async Task<Result<List<P>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var profiles = new List<P>();


            switch (request.Predicate)
            {
                case "followers":
                    profiles = await _context.UserFollowings
                    .Where(x => x.Target.UserName == request.UserName)
                    .Select(u => u.Observer)
                    .ProjectTo<P>(_mapper.ConfigurationProvider,
                                  new { currentUserName = _userAccessor.GetUserName() })
                    .ToListAsync(cancellationToken: cancellationToken);
                    break;

                case "following":
                    profiles = await _context.UserFollowings
                    .Where(x => x.Observer.UserName == request.UserName)
                    .Select(u => u.Target)
                    .ProjectTo<P>(_mapper.ConfigurationProvider,
                                  new { currentUserName = _userAccessor.GetUserName() })
                    .ToListAsync(cancellationToken: cancellationToken);
                    break;

                default:
                    break;
            }

            return Result<List<P>>.Success(profiles);
        }
    }
}