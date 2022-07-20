
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

namespace API.Extensions;
public static class ServiceExtensions
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

    public static void ConfigureSqlContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<DataContext>(options =>
{
    var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

    string connStr;

    // Depending on if in development or production, use either Heroku-provided
    // connection string, or development connection string from env var.
    if (env == "Development")
    {
        // Use connection string from file.
        connStr = configuration.GetConnectionString("DefaultConnection");
    }
    else
    {
        // Use connection string provided at runtime by Heroku.
        var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

        // Parse connection URL to connection string for Npgsql
        connUrl = connUrl.Replace("postgres://", string.Empty);
        var pgUserPass = connUrl.Split("@")[0];
        var pgHostPortDb = connUrl.Split("@")[1];
        var pgHostPort = pgHostPortDb.Split("/")[0];
        var pgDb = pgHostPortDb.Split("/")[1];
        var pgUser = pgUserPass.Split(":")[0];
        var pgPass = pgUserPass.Split(":")[1];
        var pgHost = pgHostPort.Split(":")[0];
        var pgPort = pgHostPort.Split(":")[1];

        connStr = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb}; SSL Mode=Require; Trust Server Certificate=true";
    }

    // Whether the connection string came from the local development configuration file
    // or from the environment variable from Heroku, use it to set up your DbContext.
    options.UseNpgsql(connStr);
});

    }


    public static void ConfigureCors(this IServiceCollection services) =>
          services.AddCors(opts =>
          {
              opts.AddPolicy("CorsPolicy", policy =>
              {
                  policy
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials()
                  .WithOrigins("http://localhost:3000");
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

            // token validation for SignalR
            opts.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;

                    if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                    {
                        context.Token = accessToken;
                    }

                    return Task.CompletedTask;
                }
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
