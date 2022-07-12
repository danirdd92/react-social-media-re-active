using API.Extentions;
using Microsoft.EntityFrameworkCore;
using Presistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.ConfigureSqlContext(builder.Configuration);

var app = builder.Build();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
  var context = services.GetRequiredService<DataContext>();
  await context.Database.MigrateAsync();
  await Seed.SeedData(context);
}
catch (Exception ex)
{
  var logger = services.GetRequiredService<ILogger<Program>>();
  logger.LogError(ex.Message);
}

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

// app.UseHttpsRedirection();
// app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();
