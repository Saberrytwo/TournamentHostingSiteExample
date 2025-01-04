import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";
import { useGetTournamentDetailsQuery, useListTournamentDivisionsQuery } from "../../store/apis/tournamentApi";
import "./index.css";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const RegSideBar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { tournamentID } = useParams();
  const user = useAppSelector((x) => x.auth.user);
  const { data: tournamentData, isLoading } = useGetTournamentDetailsQuery({
    TournamentID: Number(tournamentID),
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [tournStatus, setTournStatus] = useState(10);
  const [regOpen, setRegOpen] = useState(false);
  useEffect(() => {
    if (!isLoading && tournamentData && user) {
      const userExists = tournamentData.item2.some((x) => x.userID === user.userID);
      userExists ? setIsAdmin(true) : setIsAdmin(false);
      setTournStatus(tournamentData.item3.id);

      const currentDate = new Date();
      setRegOpen(
        currentDate >= new Date(tournamentData.item1.registrationStartDate) &&
          currentDate <= new Date(tournamentData.item1.registrationEndDate)
      );
    }
  }, [tournamentData, isLoading, user]);

  const { data: tournamentDivisions, isLoading: divisionsLoading } = useListTournamentDivisionsQuery({
    TournamentID: Number(tournamentID),
  });

  return (
    <>
      {!divisionsLoading && (
        <>
          <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <button className={`toggle-btn align-self-center mt-3 ${isOpen ? "margin-slide" : ""}`} onClick={onToggle}>
              {isOpen ? "<" : ">"}
            </button>
            <div className="d-flex flex-column justify-space-between mb-5">
              <a onClick={() => navigate("")} className="d-flex align-items-end">
                <img src="/icons/home.svg" width="37" className={isOpen ? "icon-padding" : ""} />
                {isOpen && <h2 className="mb-0 pb-0 text-primary-blue text-nowrap">Details</h2>}
              </a>
              <a onClick={() => navigate("teams")} className="d-flex align-items-end">
                <img src="/icons/team.svg" width="37" className={isOpen ? "icon-padding" : ""} />
                {isOpen && <h2 className="mb-0 pb-0 text-primary-blue text-nowrap">Teams</h2>}
              </a>
              <a
                onClick={
                  tournStatus > 20
                    ? () => {
                        navigate("pool/" + tournamentDivisions[0].tournamentDivisionID);
                      }
                    : tournStatus === 20
                    ? () => {
                        navigate(`/tournament/${tournamentID}/pools/${tournamentDivisions[0].tournamentDivisionID}`);
                      }
                    : () => {}
                }
                className={`d-flex align-items-end ${isAdmin && tournStatus < 20 ? "deadlink" : ""} ${
                  !isAdmin && tournStatus < 30 ? "d-none" : ""
                } `}
              >
                <img
                  src="/icons/water.svg"
                  width="37"
                  className={`${isOpen ? "icon-padding" : ""} ${tournStatus < 20 && isAdmin ? "opacity-50" : ""}`}
                />
                {isOpen && (
                  <h2
                    className={`mb-0 pb-0 text-primary-blue text-nowrap ${
                      tournStatus < 30 && isAdmin ? "opacity-50" : ""
                    }`}
                  >
                    Pool Play
                  </h2>
                )}
                {/* right now this tooltip will never show just until i feel like dealing with it */}
                {false && isAdmin && tournStatus < 30 && (
                  <span className={`tooltip-content ${isOpen ? "move-left" : ""}`}>
                    Set up pool play to use this option.
                  </span>
                )}
              </a>
              <a
                onClick={
                  tournStatus > 30
                    ? () => navigate("bracket/" + tournamentDivisions[0].tournamentDivisionID)
                    : tournStatus === 30
                    ? () =>
                        navigate(
                          `/tournament/${tournamentID}/bracketseeder/${tournamentDivisions[0].tournamentDivisionID}`
                        )
                    : () => {}
                }
                className={`d-flex align-items-end ${isAdmin && tournStatus < 30 ? "deadlink" : ""} ${
                  !isAdmin && tournStatus < 40 ? "d-none" : ""
                } `}
              >
                <img
                  src="/icons/tournament.svg"
                  width="30"
                  className={`${isOpen ? "icon-padding" : ""} ${tournStatus < 30 && isAdmin ? "opacity-50" : ""}`}
                />
                {isOpen && (
                  <h2
                    className={`mb-0 pb-0 text-primary-blue text-nowrap ${
                      tournStatus < 40 && isAdmin ? "opacity-50" : ""
                    }`}
                  >
                    Bracket
                  </h2>
                )}
                {/* right now this tooltip will never show just until i feel like dealing with it */}
                {false && isAdmin && tournStatus < 40 && (
                  <span className={`tooltip-content ${isOpen ? "move-left" : ""}`}>
                    Set up bracket to use this option.
                  </span>
                )}
              </a>
            </div>
          </div>
          <div className="bottom-bar">
            <div className="d-flex justify-content-center p-2">
              <a onClick={() => navigate("")} className="d-flex align-items-end px-4">
                <img src="/icons/home.svg" width="40" />
              </a>
              <a onClick={() => navigate("teams")} className="d-flex align-items-end px-4">
                <img src="/icons/team.svg" width="40" />
              </a>
              <a
                onClick={
                  tournStatus > 20
                    ? () => {
                        navigate("pool/" + tournamentDivisions[0].tournamentDivisionID);
                      }
                    : tournStatus === 20
                    ? () => {
                        navigate(`/tournament/${tournamentID}/pools/${tournamentDivisions[0].tournamentDivisionID}`);
                      }
                    : () => {}
                }
                className={`d-flex align-items-end px-4 ${isAdmin && tournStatus < 20 ? "deadlink" : ""} ${
                  !isAdmin && tournStatus < 30 ? "d-none" : ""
                } `}
              >
                <img
                  src="/icons/water.svg"
                  width="40"
                  className={` ${tournStatus < 20 && isAdmin ? "opacity-50" : ""}`}
                />
                {/* right now this tooltip will never show just until i feel like dealing with it */}
                {false && isAdmin && tournStatus < 20 && (
                  <span className={`tooltip-content ${isOpen ? "move-left" : ""}`}>
                    Set up pool play to use this option.
                  </span>
                )}
              </a>
              <a
                onClick={
                  tournStatus > 30
                    ? () => navigate("bracket/" + tournamentDivisions[0].tournamentDivisionID)
                    : tournStatus === 30
                    ? () =>
                        navigate(
                          `/tournament/${tournamentID}/bracketseeder/${tournamentDivisions[0].tournamentDivisionID}`
                        )
                    : () => {}
                }
                className={`d-flex align-items-end px-4 ${isAdmin && tournStatus < 30 ? "deadlink" : ""} ${
                  !isAdmin && tournStatus < 40 ? "d-none" : ""
                } `}
              >
                <img
                  src="/icons/tournament.svg"
                  width="40"
                  className={`${tournStatus < 30 && isAdmin ? "opacity-50" : ""}`}
                />
                {/* right now this tooltip will never show just until i feel like dealing with it */}
                {false && isAdmin && tournStatus < 40 && (
                  <span className={`tooltip-content ${isOpen ? "move-left" : ""}`}>
                    Set up bracket to use this option.
                  </span>
                )}
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RegSideBar;
