using AutoMapper;
using Domain;
using MediatR;
using Presistence;

namespace Application.Activities;
public class Edit
{
    public class Command : IRequest
    {
        public Activity? Activity { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public Handler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            var activityFromDb = await _context.Activities.FindAsync(request.Activity.Id);

            if (activityFromDb is null) throw new NullReferenceException();

            _mapper.Map(request.Activity, activityFromDb);
            await _context.SaveChangesAsync();

            return Unit.Value;
        }
    }
}