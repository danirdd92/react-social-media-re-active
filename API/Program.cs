using API.Extentions;
using Application.Activities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Presistence;
using Application.Core;
using API.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithFluentValidation();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.ConfigureSqlContext(builder.Configuration);
builder.Services.ConfigureCors();
builder.Services.AddMediatR(typeof(List.Handler).Assembly);
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

var app = builder.Build();

#region DB Scaffold
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
#endregion

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
