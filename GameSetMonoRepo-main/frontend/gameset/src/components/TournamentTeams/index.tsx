import { useNavigate, useParams } from "react-router-dom";
import { useListDivisionTeamsByTournamentIDQuery } from "../../store/apis/tournamentApi";
import "./index.css";
export const TournamentTeams = () => {
  const navigate = useNavigate();
  const { tournamentID } = useParams();

  const { data: divisionTeams, isLoading } = useListDivisionTeamsByTournamentIDQuery({
    TournamentID: Number(tournamentID),
  });

  if (!isLoading && (!divisionTeams || Object.keys(divisionTeams).length === 0)) {
    return (
      <div className="teams-container">
        <div className="d-flex flex-column justify-content-center align-items-center no-content h-100 w-100 gap-1">
          <img
            src="/icons/soccer_ball.png"
            alt="Soccer Ball"
            className="rotating"
            style={{ width: "100px", height: "100px", marginBottom: "20px" }}
          />
          <h3>No teams found!</h3>
          <div className="text-center">
            Be the first to register or share this tournament
            <br />
            in your area to start playing.
          </div>
          <div className="d-flex">
            <button
              type="button"
              className="register-button btn btn-primary-blue mx-2"
              onClick={() => navigate(`/tournament/${tournamentID}/register`)}
            >
              Register Now!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-center mt-2 mb-3">Registered Teams</h1>
      <div
        className={
          divisionTeams && Object.keys(divisionTeams).length > 3
            ? "d-flex teams-scroll tourn-teams"
            : "d-flex justify-content-center tourn-teams"
        }
      >
        {!isLoading &&
          divisionTeams &&
          Object.entries(divisionTeams).map(([division, twus], index) => (
            <div key={index} className="d-flex flex-column mx-3">
              <div className="d-flex justify-content-between align-items-center mb-0 team-card-header">
                <h3 className="text-center ms-1 mb-0">{division}</h3>
                <div>{twus.length} teams</div>
              </div>
              {twus.map((twu: TeamWithUsers, i) => (
                <div key={i} className="mb-2 border rounded p-3 team-card">
                  <h4 className="mb-0 pb-0">{twu.team.teamName}</h4>
                  <div className="name-text">
                    {twu.users.map((user, index) => (
                      <span key={index}>
                        {user.firstName} {user.lastName}
                        {index == twu.users.length - 1 ? " " : ", "}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </>
  );
};
