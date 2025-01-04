using Amazon;
using GameSet;
using GameSet.Repository;
using GameSet.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
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
                                              "http://localhost:3000")
                          //policy.AllowAnyOrigin()
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
    opt.UseMySql(dbSettings.ConnectionString, new MySqlServerVersion(new Version(8, 0, 21)));
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// cognito
builder.Services.AddCognitoIdentity();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["AWSCognito:Authority"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            ValidateAudience = false

        };

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
