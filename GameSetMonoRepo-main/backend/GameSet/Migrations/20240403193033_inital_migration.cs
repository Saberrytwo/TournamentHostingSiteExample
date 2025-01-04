using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameSet.Migrations
{
    public partial class inital_migration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Division",
                columns: table => new
                {
                    DivisionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DivisionName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Division", x => x.DivisionID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Team",
                columns: table => new
                {
                    TeamID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TeamName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Public = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    TeamDescription = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Team", x => x.TeamID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Tournament",
                columns: table => new
                {
                    TournamentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TournamentTitle = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Address1 = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Address2 = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    City = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    State = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Zipcode = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StartDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    RegistrationStartDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    RegistrationEndDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Description = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Latitude = table.Column<double>(type: "double", nullable: true),
                    Longitude = table.Column<double>(type: "double", nullable: true),
                    RegistrationFee = table.Column<double>(type: "double", nullable: true),
                    ImageUrl = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TournamentStatusId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tournament", x => x.TournamentID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TournamentStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TournamentStatus", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    UserID = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImageURL = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FirstName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PhoneNumber = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Birthdate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Zipcode = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Gender = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.UserID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Zipcode",
                columns: table => new
                {
                    Zip = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Latitude = table.Column<double>(type: "double", nullable: false),
                    Longitude = table.Column<double>(type: "double", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Zipcode", x => x.Zip);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TournamentDivision",
                columns: table => new
                {
                    TournamentDivisionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DivisionID = table.Column<int>(type: "int", nullable: false),
                    TournamentID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TournamentDivision", x => x.TournamentDivisionID);
                    table.ForeignKey(
                        name: "FK_TournamentDivision_Division_DivisionID",
                        column: x => x.DivisionID,
                        principalTable: "Division",
                        principalColumn: "DivisionID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TournamentDivision_Tournament_TournamentID",
                        column: x => x.TournamentID,
                        principalTable: "Tournament",
                        principalColumn: "TournamentID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TournamentAdmin",
                columns: table => new
                {
                    TournamentAdminID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TournamentID = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Role = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TournamentAdmin", x => x.TournamentAdminID);
                    table.ForeignKey(
                        name: "FK_TournamentAdmin_Tournament_TournamentID",
                        column: x => x.TournamentID,
                        principalTable: "Tournament",
                        principalColumn: "TournamentID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TournamentAdmin_User_UserID",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UserTeamStatus",
                columns: table => new
                {
                    UserTeamID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserID = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TeamID = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    InviteURL = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTeamStatus", x => x.UserTeamID);
                    table.ForeignKey(
                        name: "FK_UserTeamStatus_Team_TeamID",
                        column: x => x.TeamID,
                        principalTable: "Team",
                        principalColumn: "TeamID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserTeamStatus_User_UserID",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Group",
                columns: table => new
                {
                    GroupID = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    TournamentDivisionID = table.Column<int>(type: "int", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Group", x => x.GroupID);
                    table.ForeignKey(
                        name: "FK_Group_TournamentDivision_TournamentDivisionID",
                        column: x => x.TournamentDivisionID,
                        principalTable: "TournamentDivision",
                        principalColumn: "TournamentDivisionID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Registration",
                columns: table => new
                {
                    RegistrationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TeamID = table.Column<int>(type: "int", nullable: false),
                    GroupID = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    TournamentDivisionID = table.Column<int>(type: "int", nullable: false),
                    PoolPlaySeed = table.Column<int>(type: "int", nullable: true),
                    BracketSeed = table.Column<int>(type: "int", nullable: true),
                    TournamentRanking = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Notes = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Registration", x => x.RegistrationID);
                    table.ForeignKey(
                        name: "FK_Registration_Group_GroupID",
                        column: x => x.GroupID,
                        principalTable: "Group",
                        principalColumn: "GroupID");
                    table.ForeignKey(
                        name: "FK_Registration_Team_TeamID",
                        column: x => x.TeamID,
                        principalTable: "Team",
                        principalColumn: "TeamID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Registration_TournamentDivision_TournamentDivisionID",
                        column: x => x.TournamentDivisionID,
                        principalTable: "TournamentDivision",
                        principalColumn: "TournamentDivisionID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Match",
                columns: table => new
                {
                    MatchID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    RegistrationID1 = table.Column<int>(type: "int", nullable: true),
                    RegistrationID2 = table.Column<int>(type: "int", nullable: true),
                    TournamentDivisionID = table.Column<int>(type: "int", nullable: false),
                    Score1 = table.Column<int>(type: "int", nullable: true),
                    Score2 = table.Column<int>(type: "int", nullable: true),
                    MatchNumber = table.Column<int>(type: "int", nullable: false),
                    RoundNumber = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Match", x => x.MatchID);
                    table.ForeignKey(
                        name: "FK_Match_Registration_RegistrationID1",
                        column: x => x.RegistrationID1,
                        principalTable: "Registration",
                        principalColumn: "RegistrationID");
                    table.ForeignKey(
                        name: "FK_Match_Registration_RegistrationID2",
                        column: x => x.RegistrationID2,
                        principalTable: "Registration",
                        principalColumn: "RegistrationID");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "BoxScore",
                columns: table => new
                {
                    BoxScoreID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserID = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MatchID = table.Column<int>(type: "int", nullable: false),
                    UserTeamID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoxScore", x => x.BoxScoreID);
                    table.ForeignKey(
                        name: "FK_BoxScore_Match_MatchID",
                        column: x => x.MatchID,
                        principalTable: "Match",
                        principalColumn: "MatchID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BoxScore_User_UserID",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Division",
                columns: new[] { "DivisionID", "DivisionName" },
                values: new object[,]
                {
                    { 1, "2.0 Beginner" },
                    { 2, "3.0 Intermediate" },
                    { 3, "4.0 Advanced" },
                    { 4, "4.5 Elite" },
                    { 5, "5.0+ Premier" }
                });

            migrationBuilder.InsertData(
                table: "TournamentStatus",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 10, "Unpublished" },
                    { 20, "Published" },
                    { 30, "Pool Play" },
                    { 40, "Bracket" },
                    { 50, "Completed" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_BoxScore_MatchID",
                table: "BoxScore",
                column: "MatchID");

            migrationBuilder.CreateIndex(
                name: "IX_BoxScore_UserID",
                table: "BoxScore",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Group_TournamentDivisionID",
                table: "Group",
                column: "TournamentDivisionID");

            migrationBuilder.CreateIndex(
                name: "IX_Match_RegistrationID1",
                table: "Match",
                column: "RegistrationID1");

            migrationBuilder.CreateIndex(
                name: "IX_Match_RegistrationID2",
                table: "Match",
                column: "RegistrationID2");

            migrationBuilder.CreateIndex(
                name: "IX_Registration_GroupID",
                table: "Registration",
                column: "GroupID");

            migrationBuilder.CreateIndex(
                name: "IX_Registration_TeamID",
                table: "Registration",
                column: "TeamID");

            migrationBuilder.CreateIndex(
                name: "IX_Registration_TournamentDivisionID",
                table: "Registration",
                column: "TournamentDivisionID");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentAdmin_TournamentID",
                table: "TournamentAdmin",
                column: "TournamentID");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentAdmin_UserID",
                table: "TournamentAdmin",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentDivision_DivisionID",
                table: "TournamentDivision",
                column: "DivisionID");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentDivision_TournamentID",
                table: "TournamentDivision",
                column: "TournamentID");

            migrationBuilder.CreateIndex(
                name: "IX_UserTeamStatus_TeamID",
                table: "UserTeamStatus",
                column: "TeamID");

            migrationBuilder.CreateIndex(
                name: "IX_UserTeamStatus_UserID",
                table: "UserTeamStatus",
                column: "UserID");
            var sqlFile = Path.Combine("./Migrations/zip_migrations.Sql");
            migrationBuilder.Sql(File.ReadAllText(sqlFile));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BoxScore");

            migrationBuilder.DropTable(
                name: "TournamentAdmin");

            migrationBuilder.DropTable(
                name: "TournamentStatus");

            migrationBuilder.DropTable(
                name: "UserTeamStatus");

            migrationBuilder.DropTable(
                name: "Zipcode");

            migrationBuilder.DropTable(
                name: "Match");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Registration");

            migrationBuilder.DropTable(
                name: "Group");

            migrationBuilder.DropTable(
                name: "Team");

            migrationBuilder.DropTable(
                name: "TournamentDivision");

            migrationBuilder.DropTable(
                name: "Division");

            migrationBuilder.DropTable(
                name: "Tournament");
        }
    }
}
