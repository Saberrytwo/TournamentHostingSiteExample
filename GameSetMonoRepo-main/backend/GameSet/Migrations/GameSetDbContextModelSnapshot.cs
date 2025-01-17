﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace GameSet.Migrations
{
    [DbContext(typeof(GameSetDbContext))]
    partial class GameSetDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.26")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("GameSet.Models.BoxScore", b =>
                {
                    b.Property<int>("BoxScoreID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("MatchID")
                        .HasColumnType("int");

                    b.Property<string>("UserID")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<int>("UserTeamID")
                        .HasColumnType("int");

                    b.HasKey("BoxScoreID");

                    b.HasIndex("MatchID");

                    b.HasIndex("UserID");

                    b.ToTable("BoxScore");
                });

            modelBuilder.Entity("GameSet.Models.Division", b =>
                {
                    b.Property<int>("DivisionID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("DivisionName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)");

                    b.HasKey("DivisionID");

                    b.ToTable("Division");

                    b.HasData(
                        new
                        {
                            DivisionID = 1,
                            DivisionName = "2.0 Beginner"
                        },
                        new
                        {
                            DivisionID = 2,
                            DivisionName = "3.0 Intermediate"
                        },
                        new
                        {
                            DivisionID = 3,
                            DivisionName = "4.0 Advanced"
                        },
                        new
                        {
                            DivisionID = 4,
                            DivisionName = "4.5 Elite"
                        },
                        new
                        {
                            DivisionID = 5,
                            DivisionName = "5.0+ Premier"
                        });
                });

            modelBuilder.Entity("GameSet.Models.Group", b =>
                {
                    b.Property<Guid>("GroupID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<int>("Order")
                        .HasColumnType("int");

                    b.Property<int>("TournamentDivisionID")
                        .HasColumnType("int");

                    b.HasKey("GroupID");

                    b.HasIndex("TournamentDivisionID");

                    b.ToTable("Group");
                });

            modelBuilder.Entity("GameSet.Models.Match", b =>
                {
                    b.Property<int>("MatchID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("MatchNumber")
                        .HasColumnType("int");

                    b.Property<int?>("RegistrationID1")
                        .HasColumnType("int");

                    b.Property<int?>("RegistrationID2")
                        .HasColumnType("int");

                    b.Property<int>("RoundNumber")
                        .HasColumnType("int");

                    b.Property<int?>("Score1")
                        .HasColumnType("int");

                    b.Property<int?>("Score2")
                        .HasColumnType("int");

                    b.Property<int>("TournamentDivisionID")
                        .HasColumnType("int");

                    b.HasKey("MatchID");

                    b.HasIndex("RegistrationID1");

                    b.HasIndex("RegistrationID2");

                    b.ToTable("Match");
                });

            modelBuilder.Entity("GameSet.Models.Registration", b =>
                {
                    b.Property<int>("RegistrationID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("BracketSeed")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<Guid?>("GroupID")
                        .HasColumnType("char(36)");

                    b.Property<string>("Notes")
                        .HasMaxLength(1000)
                        .HasColumnType("varchar(1000)");

                    b.Property<int?>("PoolPlaySeed")
                        .HasColumnType("int");

                    b.Property<int>("TeamID")
                        .HasColumnType("int");

                    b.Property<int>("TournamentDivisionID")
                        .HasColumnType("int");

                    b.Property<int?>("TournamentRanking")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("RegistrationID");

                    b.HasIndex("GroupID");

                    b.HasIndex("TeamID");

                    b.HasIndex("TournamentDivisionID");

                    b.ToTable("Registration");
                });

            modelBuilder.Entity("GameSet.Models.Team", b =>
                {
                    b.Property<int>("TeamID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<bool>("Public")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("TeamDescription")
                        .HasMaxLength(1000)
                        .HasColumnType("varchar(1000)");

                    b.Property<string>("TeamName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)");

                    b.HasKey("TeamID");

                    b.ToTable("Team");
                });

            modelBuilder.Entity("GameSet.Models.Tournament", b =>
                {
                    b.Property<int>("TournamentID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Address1")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Address2")
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)");

                    b.Property<string>("City")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("Description")
                        .HasMaxLength(1000)
                        .HasColumnType("varchar(1000)");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("ImageUrl")
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)");

                    b.Property<double?>("Latitude")
                        .HasColumnType("double");

                    b.Property<double?>("Longitude")
                        .HasColumnType("double");

                    b.Property<DateTime>("RegistrationEndDate")
                        .HasColumnType("datetime(6)");

                    b.Property<double?>("RegistrationFee")
                        .HasColumnType("double");

                    b.Property<DateTime>("RegistrationStartDate")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("State")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<int>("TournamentStatusId")
                        .HasColumnType("int");

                    b.Property<string>("TournamentTitle")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Zipcode")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("varchar(10)");

                    b.HasKey("TournamentID");

                    b.ToTable("Tournament");
                });

            modelBuilder.Entity("GameSet.Models.TournamentAdmin", b =>
                {
                    b.Property<int>("TournamentAdminID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("TournamentID")
                        .HasColumnType("int");

                    b.Property<string>("UserID")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("TournamentAdminID");

                    b.HasIndex("TournamentID");

                    b.HasIndex("UserID");

                    b.ToTable("TournamentAdmin");
                });

            modelBuilder.Entity("GameSet.Models.TournamentDivision", b =>
                {
                    b.Property<int>("TournamentDivisionID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("DivisionID")
                        .HasColumnType("int");

                    b.Property<int>("TournamentID")
                        .HasColumnType("int");

                    b.HasKey("TournamentDivisionID");

                    b.HasIndex("DivisionID");

                    b.HasIndex("TournamentID");

                    b.ToTable("TournamentDivision");
                });

            modelBuilder.Entity("GameSet.Models.TournamentStatus", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("TournamentStatus");

                    b.HasData(
                        new
                        {
                            Id = 10,
                            Name = "Unpublished"
                        },
                        new
                        {
                            Id = 20,
                            Name = "Published"
                        },
                        new
                        {
                            Id = 30,
                            Name = "Pool Play"
                        },
                        new
                        {
                            Id = 40,
                            Name = "Bracket"
                        },
                        new
                        {
                            Id = 50,
                            Name = "Completed"
                        });
                });

            modelBuilder.Entity("GameSet.Models.User", b =>
                {
                    b.Property<string>("UserID")
                        .HasColumnType("varchar(255)");

                    b.Property<DateTime?>("Birthdate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Email")
                        .HasColumnType("longtext");

                    b.Property<string>("FirstName")
                        .HasColumnType("longtext");

                    b.Property<string>("Gender")
                        .HasColumnType("longtext");

                    b.Property<string>("ImageURL")
                        .HasColumnType("longtext");

                    b.Property<string>("LastName")
                        .HasColumnType("longtext");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("longtext");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Zipcode")
                        .HasColumnType("longtext");

                    b.HasKey("UserID");

                    b.ToTable("User");
                });

            modelBuilder.Entity("GameSet.Models.UserTeamStatus", b =>
                {
                    b.Property<int>("UserTeamID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("InviteURL")
                        .HasColumnType("longtext");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("TeamID")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("UserID")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("UserTeamID");

                    b.HasIndex("TeamID");

                    b.HasIndex("UserID");

                    b.ToTable("UserTeamStatus");
                });

            modelBuilder.Entity("GameSet.Models.Zipcode", b =>
                {
                    b.Property<string>("Zip")
                        .HasColumnType("varchar(255)");

                    b.Property<double>("Latitude")
                        .HasColumnType("double");

                    b.Property<double>("Longitude")
                        .HasColumnType("double");

                    b.HasKey("Zip");

                    b.ToTable("Zipcode");
                });

            modelBuilder.Entity("GameSet.Models.BoxScore", b =>
                {
                    b.HasOne("GameSet.Models.Match", "Match")
                        .WithMany()
                        .HasForeignKey("MatchID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GameSet.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Match");

                    b.Navigation("User");
                });

            modelBuilder.Entity("GameSet.Models.Group", b =>
                {
                    b.HasOne("GameSet.Models.TournamentDivision", "TournamentDivision")
                        .WithMany()
                        .HasForeignKey("TournamentDivisionID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("TournamentDivision");
                });

            modelBuilder.Entity("GameSet.Models.Match", b =>
                {
                    b.HasOne("GameSet.Models.Registration", "Registration1")
                        .WithMany()
                        .HasForeignKey("RegistrationID1");

                    b.HasOne("GameSet.Models.Registration", "Registration2")
                        .WithMany()
                        .HasForeignKey("RegistrationID2");

                    b.Navigation("Registration1");

                    b.Navigation("Registration2");
                });

            modelBuilder.Entity("GameSet.Models.Registration", b =>
                {
                    b.HasOne("GameSet.Models.Group", "Group")
                        .WithMany()
                        .HasForeignKey("GroupID");

                    b.HasOne("GameSet.Models.Team", "Team")
                        .WithMany()
                        .HasForeignKey("TeamID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GameSet.Models.TournamentDivision", "TournamentDivision")
                        .WithMany()
                        .HasForeignKey("TournamentDivisionID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Group");

                    b.Navigation("Team");

                    b.Navigation("TournamentDivision");
                });

            modelBuilder.Entity("GameSet.Models.TournamentAdmin", b =>
                {
                    b.HasOne("GameSet.Models.Tournament", "Tournament")
                        .WithMany()
                        .HasForeignKey("TournamentID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GameSet.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Tournament");

                    b.Navigation("User");
                });

            modelBuilder.Entity("GameSet.Models.TournamentDivision", b =>
                {
                    b.HasOne("GameSet.Models.Division", "Division")
                        .WithMany()
                        .HasForeignKey("DivisionID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GameSet.Models.Tournament", "Tournament")
                        .WithMany()
                        .HasForeignKey("TournamentID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Division");

                    b.Navigation("Tournament");
                });

            modelBuilder.Entity("GameSet.Models.UserTeamStatus", b =>
                {
                    b.HasOne("GameSet.Models.Team", "Team")
                        .WithMany()
                        .HasForeignKey("TeamID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GameSet.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Team");

                    b.Navigation("User");
                });
#pragma warning restore 612, 618
        }
    }
}
