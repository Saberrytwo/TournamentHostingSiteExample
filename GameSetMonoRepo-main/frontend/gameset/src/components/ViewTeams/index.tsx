import "./index.css";
import { useAppSelector } from "../../hooks/hooks";
import { useListUserTeamsByUserIDQuery } from "../../store/apis/teamApi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ViewTeams = () => {
  const navigate = useNavigate();
  const [teamUsers, setTeamUsers] = useState<TeamWithUsers[]>([]);
  const user = useAppSelector((state) => state.auth.user);
  const { data: userTeams, isLoading: isLoading } = useListUserTeamsByUserIDQuery({ UserID: user.userID });

  useEffect(() => {
    if (!isLoading && userTeams) {
      let uniqueTeamIDs = new Set<number>(); // Create a set to store unique teamIDs
      let newTeamUsers: TeamWithUsers[] = [];
      userTeams.forEach((userTeam: UserTeamStatus) => {
        const teamID = userTeam.team.teamID;
        if (!uniqueTeamIDs.has(teamID!)) {
          uniqueTeamIDs.add(teamID!); // Add unique teamID to the set
          const teamUser: TeamWithUsers = {
            team: userTeam.team,
            users: userTeams.filter((ut: UserTeamStatus) => ut.teamID === teamID).map((ut) => ut.user),
          };
          newTeamUsers.push(teamUser);
        }
      });
      setTeamUsers(newTeamUsers);
    }
  }, [isLoading, userTeams]);

  return (
    <main>
      <div className="d-flex justify-content-center">
        <div className="mt-5 d-flex justify-content-between align-items-center my-teams-title">
          <h1 className="pb-0 mb-0">My Teams</h1>
          <button type="button" className="btn btn-primary-blue" onClick={() => navigate(`createteam`)}>
            {" "}
            + Team
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-center w-100">
        {!isLoading && (
          <div className="d-flex flex-column align-items-center justify-content-center w-100">
            {teamUsers?.length === 0 && (
              <>
                {/* <h3 className="mt-5">You are not part of any teams</h3>
                <button type="button" className="btn btn-primary-blue" onClick={() => navigate(`createteam`)}>
                  {" "}
                  Create First Team
                </button> */}
                <div className="w-100 d-flex flex-column justify-content-center align-items-center no-content">
                  <img
                    src="/icons/soccer_ball.png"
                    alt="Soccer Ball"
                    className="rotating"
                    style={{ width: "100px", height: "100px", marginBottom: "20px" }}
                  />
                  <h3>No teams found!</h3>
                  <div className="text-center">
                    Sorry, you are not a part of a team.
                    <br />
                    <a className="fake-link" onClick={() => navigate("/teams/createteam")}>
                      Create a team
                    </a>{" "}
                    in your area to start playing.
                  </div>
                </div>
              </>
            )}
            {teamUsers?.map((userTeam: TeamWithUsers) => (
              <div
                key={userTeam.team.teamID}
                className="mt-3 d-flex justify-content-between align-items-center team-border clickable"
                onClick={() => navigate(`${userTeam.team.teamID}/updateteam`)}
              >
                <div>
                  <h3 className="mb-0">{userTeam.team.teamName}</h3>
                  <p className="text-gray">
                    Owner: {userTeams?.filter((u: UserTeamStatus) => u.status === "Owner")[0].user.userName}
                  </p>
                  <div className="d-flex">
                    {userTeam.users.map((u: User) => (
                      <img
                        src={u.imageURL && u.imageURL != "" ? u.imageURL : "/icons/user.svg"}
                        width="25"
                        height="25"
                        className="me-2 rounded-circle"
                        key={u.userID}
                      />
                    ))}
                  </div>
                </div>
                <h1>{""}</h1>
                <img className="bg-white" src={"/icons/pencil.svg"} width={37} alt="Status Icon" />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
