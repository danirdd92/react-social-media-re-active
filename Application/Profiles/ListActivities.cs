
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles;
public class ListActivities
{
    public class Query : IRequest<Result<List<UserActivityDto>>>
    {
        public string UserName { get; set; }
        public string Predicate { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public Handler(DataContext context, IMapper Mapper)
        {
            _context = context;
            _mapper = Mapper;
        }

        public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.ActivityAttendees
                .Where(u => u.AppUser.UserName == request.UserName)
                .OrderBy(a => a.Activity.Date)
                .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                .AsQueryable();

            query = request.Predicate switch
            {
                "past" => query.Where(a => a.Date <= DateTime.Now),
                "hosting" => query.Where(a => a.HostUserName == request.UserName),
                _ => query.Where(a => a.Date >= DateTime.Now)
            };

            var activities = await query.ToListAsync(cancellationToken: cancellationToken);
            return Result<List<UserActivityDto>>.Success(activities);
        }
    }
}