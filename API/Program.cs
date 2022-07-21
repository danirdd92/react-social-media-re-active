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

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

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

app.UseMiddleware<ExceptionMiddleware>();
app.UseXContentTypeOptions();
app.UseReferrerPolicy(opts => opts.NoReferrer());
app.UseXXssProtection(opts => opts.EnabledWithBlockMode());
app.UseXfo(opts => opts.Deny());
app.UseCsp(opts => opts.BlockAllMixedContent()
                                 .StyleSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "https://fonts.googleapis.com"))
                                 .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
                                 .FormActions(s => s.Self())
                                 .FrameAncestors(s => s.Self())
                                 .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com"))
                                 .ScriptSources(s => s.Self()));
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.Use(async (context, next) =>
    {
        context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
        await next.Invoke();
    });
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<ChatHub>("/chat");
    endpoints.MapFallbackToController("Index", "Fallback");
});

await app.RunAsync();
