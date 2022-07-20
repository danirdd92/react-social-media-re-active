using Application.Contracts;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities;
public class List
{
    public class Query : IRequest<Result<PagedList<ActivityDto>>>
    {
        public ActivityParams Params { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
        {
            _mapper = mapper;
            _userAccessor = userAccessor;
            _context = context;
        }

        public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.Activities
                .Where(d => d.Date >= request.Params.StartDate)
                .OrderBy(d => d.Date)
                //AutoMapper.QueryableExtensions
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new { currentUserName = _userAccessor.GetUserName() })
                .AsQueryable();

            if (request.Params.IsGoing && !request.Params.IsHost)
            {
                query = query.Where(x => x.Attendees.Any(a => a.UserName == _userAccessor.GetUserName()));
            }

            if (request.Params.IsHost && !request.Params.IsGoing)
            {
                query = query.Where(x => x.HostUserName == _userAccessor.GetUserName());
            }

            var activities = await PagedList<ActivityDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize);

            return Result<PagedList<ActivityDto>>.Success(activities);
        }
    }
}