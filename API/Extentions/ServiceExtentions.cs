
using Microsoft.EntityFrameworkCore;
using FluentValidation.AspNetCore;
using Persistence;
using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Identity;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Infrastructure.Security;

namespace API.Extentions;
public static class ServiceExtentions
{
    public static void AddControllersWithFluentValidation(this IServiceCollection services) =>
    services.AddControllers(opts =>
    {
        // default all routes to need authorization
        var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
        opts.Filters.Add(new AuthorizeFilter(policy));
    })

    .AddFluentValidation(config =>
        {
            config.RegisterValidatorsFromAssemblyContaining<Create>();
        });

    public static void ConfigureSqlContext(this IServiceCollection services, IConfiguration configuration) =>
        services.AddDbContext<DataContext>(opts => opts.UseSqlite(configuration.GetConnectionString("DefaultConnection")));

    public static void ConfigureCors(this IServiceCollection services) =>
          services.AddCors(opts =>
          {
              opts.AddPolicy("CorsPolicy", policy =>
              {
                  policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
              });
          });

    public static void ConfigureIdentityServices(this IServiceCollection services, IConfiguration config)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        services.AddIdentityCore<AppUser>(opts =>
        {
            opts.Password.RequireNonAlphanumeric = false;
        })
        .AddEntityFrameworkStores<DataContext>()
        .AddSignInManager<SignInManager<AppUser>>();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(opts =>
        {
            opts.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = false,
                ValidateAudience = false
            };
        });
        services.AddAuthorization(opts =>
        {
            opts.AddPolicy("IsActivityHost", policy =>
            {
                policy.Requirements.Add(new IsHostRequirment());
            });
        });
        services.AddTransient<IAuthorizationHandler, IsHostRequirmentHandler>();
        services.AddScoped<TokenService>();
    }


}
