import { CustomAuthenticator } from "../components/Authenticator";
import { SingleElimination } from "../components/Bracket";
import { CreateTeam } from "../components/CreateTeam";
import { Oops } from "../components/Oops";
import { Pool } from "../components/Pool";
import { BracketSeeder } from "../components/Pools/BracketSeeder";
import { Pools } from "../components/Pools/Index";
import { Profile } from "../components/Profile";
import { TournamentRegistration } from "../components/Registration";
import { CreateTournament } from "../components/TournamentCreation";
import { TournamentDetails } from "../components/TournamentDetails";
import { DiscoveryPage } from "../components/TournamentDiscovery";
import { TournamentTeams } from "../components/TournamentTeams";
import { UpdateTeam } from "../components/UpdateTeam";
import { ViewTeams } from "../components/ViewTeams";
import { MainLayout } from "../layouts/MainLayout";
import { RegistrationLayout } from "../layouts/RegistrationLayout";

export const Routes = () => {
  return [
    {
      path: "*",
      element: (
        <>
          <MainLayout />
          <Oops />
        </>
      ),
    },
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "login",
          element: (
            <CustomAuthenticator>
              <DiscoveryPage />
            </CustomAuthenticator>
          ),
        },
        { path: "", element: <DiscoveryPage /> },
      ],
    },
    {
      path: "/user",
      element: <MainLayout />,
      children: [
        {
          path: "profile",
          element: (
            <CustomAuthenticator>
              <Profile />
            </CustomAuthenticator>
          ),
        },
        { path: "createteam", element: <CreateTeam /> },
        { path: "", element: <DiscoveryPage /> },
      ],
    },
    {
      path: "/createtournament",
      element: <MainLayout />,
      children: [
        {
          path: "",
          element: (
            <CustomAuthenticator>
              <CreateTournament />
            </CustomAuthenticator>
          ),
        },
      ],
    },
    {
      path: "/tournament/:tournamentID",
      element: <RegistrationLayout />,
      children: [
        {
          path: "",
          element: <TournamentDetails />,
        },
        {
          path: "register",
          element: (
            <CustomAuthenticator>
              <TournamentRegistration />
            </CustomAuthenticator>
          ),
        },
        {
          path: "updatetournament",
          element: (
            <CustomAuthenticator>
              <CreateTournament />
            </CustomAuthenticator>
          ),
        },
        {
          path: "pool/:tournamentdivisionID",
          element: <Pool />,
        },
        {
          path: "bracket/:tournamentdivisionID",
          element: <SingleElimination />,
        },
        {
          path: "pools/:divisionID",
          element: (
            <CustomAuthenticator>
              <Pools />
            </CustomAuthenticator>
          ),
        },
        {
          path: "bracketseeder/:divisionID",
          element: (
            <CustomAuthenticator>
              <BracketSeeder />
            </CustomAuthenticator>
          ),
        },
        {
          path: "teams",
          element: <TournamentTeams />,
        },
      ],
    },
    {
      path: "/teams",
      element: <MainLayout />,
      children: [
        {
          path: "",
          element: (
            <CustomAuthenticator>
              <ViewTeams />{" "}
            </CustomAuthenticator>
          ),
        },
        {
          path: ":teamID/updateteam",
          element: (
            <CustomAuthenticator>
              <UpdateTeam />{" "}
            </CustomAuthenticator>
          ),
        },
        {
          path: "createteam",
          element: (
            <CustomAuthenticator>
              <CreateTeam />
            </CustomAuthenticator>
          ),
        },
      ],
    },
  ];
};
