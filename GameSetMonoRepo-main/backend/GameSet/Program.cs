using Amazon;
using GameSet;
using GameSet.Repository;
using GameSet.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

var MyAllowSpecificOrigins = "GameSet Allowed Origins";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<IGameSetRepository, GameSetRepository>();
builder.Services.AddScoped<IGameSetService, GameSetService>();
builder.Services.AddControllers();
builder.Services.AddOptions<DatabaseSettings>().BindConfiguration("DatabaseSettings");
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("https://gameset.link",
                                              "https://www.gameset.link",
                                              "http://localhost:5173",
                                              "http://127.0.0.1:5173",
                                              "https://localhost:5173",
                                              "https://127.0.0.1:5173",
                                              "localhost:5174",
                                              "http://localhost:5174",
                                              "http://127.0.0.1:5174")
                                                  .AllowAnyHeader()
                                                  .AllowAnyMethod(); ;
                      });
});

var configuration = builder.Configuration;
var dbSettings = new DatabaseSettings();

// Load additional configurations based on environment
if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
{
    configuration.AddUserSecrets<Program>();

    configuration.SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.Development.json");

    // Store the connection string components in variables
    dbSettings.ConnectionString = configuration["ConnectionString"];
 }
else
{
    builder.Configuration.AddSecretsManager(null, RegionEndpoint.USEast1, configurator: config => {
        config.KeyGenerator = (secret, name) => name.Replace("__", ":");
    });

    dbSettings.ConnectionString = configuration.GetSection("DatabaseSettings:ConnectionString").Value;
}


// Register the DbContext with the DI container
builder.Services.AddDbContext<GameSetDbContext>(opt =>
{
    opt.UseMySql(dbSettings.ConnectionString, new MySqlServerVersion(new Version(8, 2, 0)));
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// cognito
builder.Services.AddCognitoIdentity();

builder.Services.AddAuthentication(o => {
    o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
        .AddJwtBearer(cfg =>
        {
            cfg.Authority = builder.Configuration["AWSCognito:Authority"];
            cfg.RequireHttpsMetadata = false;
            cfg.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                ValidateAudience = false
            };
            cfg.Configuration = new OpenIdConnectConfiguration();
        });

var app = builder.Build();

app.MapGet("/", () =>
{
    return Results.Ok(); // This will return a 200 status code
});

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
app.UseSwagger();
app.UseSwaggerUI();
//}
app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
