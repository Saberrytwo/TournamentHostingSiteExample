using GameSet.Models;
using GameSet.Models.ResponseObjects;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

public class GameSetDbContext : DbContext
{
    public GameSetDbContext(DbContextOptions<GameSetDbContext> options) : base(options)
    { }

    public DbSet<User> User { get; set; }
    public DbSet<Team> Team { get; set; }
    public DbSet<UserTeamStatus> UserTeamStatus { get; set; }
    public DbSet<BoxScore> BoxScore { get; set; }
    public DbSet<Division> Division { get; set; }
    public DbSet<Group> Group { get; set; }
    public DbSet<Match> Match { get; set; }
    public DbSet<Registration> Registration { get; set; }
    public DbSet<Tournament> Tournament { get; set; }
    public DbSet<TournamentAdmin> TournamentAdmin { get; set; }
    public DbSet<TournamentDivision> TournamentDivision { get; set; }
    public DbSet<TournamentStatus> TournamentStatus { get; set; }
    public DbSet<Zipcode> Zipcode { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        new Seeder(modelBuilder).SeedData();
    }

}