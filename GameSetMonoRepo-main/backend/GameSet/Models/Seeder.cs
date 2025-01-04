using GameSet.Models;
using Microsoft.EntityFrameworkCore;

public class Seeder
{
    private readonly ModelBuilder _modelBuilder;

    public Seeder(ModelBuilder modelBuilder)
    {
        _modelBuilder = modelBuilder;
    }

    public void SeedData()
    {
        _modelBuilder.Entity<TournamentStatus>().HasData(
            new TournamentStatus
            {
                Id = 10,
                Name = "Unpublished",
            },
            new TournamentStatus
            {
                Id = 20,
                Name = "Published",
            },
            new TournamentStatus
            {
                Id = 30,
                Name = "Pool Play",
            },
            new TournamentStatus
            {
                Id = 40,
                Name = "Bracket",
            },
            new TournamentStatus
            {
                Id = 50,
                Name = "Completed"
            }
         );
        _modelBuilder.Entity<Division>().HasData(
            new Division
            {
                DivisionID = 1,
                DivisionName = "2.0 Beginner"
            },
            new Division
            {
                DivisionID = 2,
                DivisionName = "3.0 Intermediate"
            },
            new Division
            {
                DivisionID = 3,
                DivisionName = "4.0 Advanced"
            },
            new Division
            {
                DivisionID = 4,
                DivisionName = "4.5 Elite"
            },
            new Division
            {
                DivisionID = 5,
                DivisionName = "5.0+ Premier"
            }
        );
    }
}

