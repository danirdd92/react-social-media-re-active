
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace API.Extentions;
public static class ServiceExtentions
{
  public static void ConfigureSqlContext(this IServiceCollection services, IConfiguration configuration) =>
      services.AddDbContext<DataContext>(opts => opts.UseSqlite(configuration.GetConnectionString("DefaultConnection")));

}
