using API.Extensions;
using Application.Activities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.Core;
using API.Middleware;
using Microsoft.AspNetCore.Identity;
using Domain;
using Application.Contracts;
using Infrastructure.Security;
using Infrastructure.Photos;
using API.SignalR;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.ConfigureCors();
builder.Services.AddControllersWithFluentValidation();
builder.Services.ConfigureSqlContext(builder.Configuration);
builder.Services.ConfigureIdentityServices(builder.Configuration);
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
builder.Services.AddMediatR(typeof(List.Handler).Assembly);
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));

builder.Services.AddScoped<IUserAccessor, UserAccessor>();
builder.Services.AddScoped<IPhotoAccessor, PhotoAccessor>();

var app = builder.Build();

#region DB Scaffold
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex.Message);
}
#endregion

app.UseRouting();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<ChatHub>("/chat");
});

app.Run();
