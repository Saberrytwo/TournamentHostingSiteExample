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
        // User Seed
        _modelBuilder.Entity<User>().HasData(
            new User {
                UserID = "61b830e1-21e9-4e77-b0c5-58dc578b2ddd",
                UserName= "delangea",
                FirstName ="Anna",
                LastName = "DeLange",
                Email="anna.delange3@gmail.com",
                PhoneNumber="7202563730",
                Birthdate=new DateTime(1999, 7, 23),
                Zipcode="84003",
                Gender="Female"
            },
            new User {
                UserID = "7e712c8f-3248-4418-8fdd-619fa9f1d104",
                UserName= "saberrytwo",
                FirstName ="Solomon",
                LastName = "Berry",
                Email="saberrytwo@gmail.com",
                Birthdate=new DateTime(2001, 4, 13),
                Zipcode="84606",
                Gender="Male"
            },
            new User {
                UserID = "50c741a8-4119-420a-81d3-da519aed2f3d",
                UserName="matt",
                FirstName ="Matt",
                LastName = "Corbett",
                Email="matthewecorbett@gmail.com",
                Birthdate=new DateTime(1998, 12, 31),
                Zipcode="84606",
                Gender="Male"
            }
        );
        _modelBuilder.Entity<Team>().HasData(
            new Team
            {
                TeamID = 1,
                TeamName = "Net Ninjas",
                Public = true
            },
            new Team
            {
                TeamID = 2,
                TeamName = "Spike Freaks",
                Public = true
            }
        );
        _modelBuilder.Entity<UserTeamStatus>().HasData(
            new UserTeamStatus
            {
                UserTeamID = 1,
                UserID = "61b830e1-21e9-4e77-b0c5-58dc578b2ddd",
                TeamID = 1,
                Status = "Active",
                Timestamp = DateTime.Now
            },
            new UserTeamStatus
            {
                UserTeamID = 2,
                UserID = "7e712c8f-3248-4418-8fdd-619fa9f1d104",
                TeamID = 1,
                Status = "Active",
                Timestamp = DateTime.Now
            },
            new UserTeamStatus
            {
                UserTeamID = 3,
                UserID = "7e712c8f-3248-4418-8fdd-619fa9f1d104",
                TeamID = 2,
                Status = "Active",
                Timestamp = DateTime.Now
            },
            new UserTeamStatus
            {
                UserTeamID = 4,
                UserID = "50c741a8-4119-420a-81d3-da519aed2f3d",
                TeamID = 2,
                Status = "Active",
                Timestamp = DateTime.Now
            }
        );
        _modelBuilder.Entity<Tournament>().HasData(
            new Tournament
            {
                TournamentID = 1,
                TournamentTitle = "Provo Tester!",
                Address1 = "123 Main St",
                City= "Provo",
                State="Utah",
                Zipcode="84606",
                StartDate=new DateTime(2024, 1, 20),
                EndDate=new DateTime(2024, 1, 25),
                RegistrationStartDate = new DateTime(2024, 1, 15),
                RegistrationEndDate = new DateTime(2024, 1, 19),
                Description= "Test Tournament"
            }
        );

        _modelBuilder.Entity<TournamentAdmin>().HasData(
            new TournamentAdmin
            {
                TournamentAdminID = 1,
                TournamentID = 1,
                UserID="61b830e1-21e9-4e77-b0c5-58dc578b2ddd",
                Role="Owner"
            }
        );
        _modelBuilder.Entity<Division>().HasData(
            new Division
            {
                DivisionID = 1,
                DivisionName = "Beginner"
            },
            new Division
            {
                DivisionID = 2,
                DivisionName = "Advanced"
            }
        );
        _modelBuilder.Entity<TournamentDivision>().HasData(
            new TournamentDivision
            {
                TournamentDivisionID = 1,
                TournamentID = 1,
                DivisionID = 1
            },
            new TournamentDivision
            {
                TournamentDivisionID = 2,
                TournamentID = 1,
                DivisionID = 2
            }
        );
        _modelBuilder.Entity<Group>().HasData(
            new Group
            {
                GroupID = 1,
                GroupName = "A",
                TournamentDivisionID = 1
            }
        );
        _modelBuilder.Entity<Registration>().HasData(
            new Registration
            {
                RegistrationID = 1,
                TeamID = 1,
                TournamentDivisionID = 1,
                GroupID = 1,
                Timestamp = DateTime.Now,
            },
            new Registration
            {
                RegistrationID = 2,
                TeamID = 1,
                TournamentDivisionID = 2,
                Timestamp = DateTime.Now,
            }
        );
    }
}

