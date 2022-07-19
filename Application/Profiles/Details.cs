
using Application.Contracts;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles;
public class Details
{
    public class Query : IRequest<Result<Profile>>
    {
        public string UserName { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<Profile>>
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

        public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.ProjectTo<Profile>(
                _mapper.ConfigurationProvider,
                new { currentUserName = _userAccessor.GetUserName() })
                .SingleOrDefaultAsync(
                    x => x.UserName == request.UserName,
                    cancellationToken: cancellationToken);

            if (user is null) return null;

            return Result<Profile>.Success(user);
        }
    }
}