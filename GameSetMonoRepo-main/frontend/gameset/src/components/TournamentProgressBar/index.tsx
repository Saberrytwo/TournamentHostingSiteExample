import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import useScreenSize from "../../hooks/useScreenSize";
import { useListTounamentStatusesQuery, useUpdateTournamentStatusMutation } from "../../store/apis/tournamentApi";
import "./index.css";

interface TournamentProgressBarProps {
  tournamentID: number;
  tournamentStatusID: number;
  isTournamentAdmin: boolean;
}

export const TournamentProgressBar = ({
  tournamentID,
  tournamentStatusID,
  isTournamentAdmin,
}: TournamentProgressBarProps) => {
  const { data } = useListTounamentStatusesQuery({});
  const [progressPercent, setProgressPercent] = useState(0);
  let screensize = useScreenSize();
  const iconSize = screensize.width < 50 ? 30 : 37;

  const statusLookupDictionary = {
    10: {
      icon: "/icons/pencil.svg",
      size: iconSize,
      nextStatusID: 20,
      previousStatusID: null,
      progressNavigateRoute: "",
      regressNavigateRoute: "",
      regressBtnText: null,
      progressBtnTxt: "Publish",
    },
    20: {
      icon: "/icons/home.svg",
      size: iconSize,
      nextStatusID: 30,
      previousStatusID: 10,
      progressNavigateRoute: "#pool",
      regressNavigateRoute: "",
      regressBtnText: "Edit Details",
      progressBtnTxt: "Set Pools",
    },
    30: {
      icon: "/icons/water.svg",
      size: iconSize,
      nextStatusID: 40,
      previousStatusID: 20,
      progressNavigateRoute: "#bracket",
      regressNavigateRoute: "",
      regressBtnText: "Reopen Registration",
      progressBtnTxt: "Set Bracket",
    },
    40: {
      icon: "/icons/tournament.svg",
      size: iconSize,
      nextStatusID: 50,
      previousStatusID: 30,
      progressNavigateRoute: "#results",
      regressNavigateRoute: "#pool",
      regressBtnText: "Edit Pools",
      progressBtnTxt: "Complete Tournament",
    },
    50: {
      icon: "/icons/trophy.svg",
      size: iconSize,
      nextStatusID: null,
      previousStatusID: 40,
      progressNavigateRoute: "",
      regressNavigateRoute: "#bracket",
      regressBtnText: "Edit Bracket",
      progressBtnTxt: null,
    },
  };

  useEffect(() => {
    const effectiveTournamentStatusID = tournamentStatusID ?? 10;
    if (data && data.length > 0) {
      const statusIndex = data.findIndex((status) => status.id === effectiveTournamentStatusID);
      let newProgressPercent = statusIndex >= 0 ? (statusIndex / (data.length - 1)) * 100 : 0;
      newProgressPercent += (1 / (data.length - 1) / 2) * 100;
      setProgressPercent(newProgressPercent);
    } else {
      setProgressPercent(0);
    }
  }, [data, tournamentStatusID]);

  return (
    <div className="progress-bar-container">
      <div className="progressBar">
        <ProgressBar
          filledBackground="var(--gameset-primary-blue)"
          percent={progressPercent}
          hasStepZero={true}
          height={10}
        >
          {data?.map((status, index) => {
            const isAccomplished = status.id <= tournamentStatusID;
            const iconDetails = statusLookupDictionary[status.id];
            const width = iconDetails.size;

            return (
              <Step accomplished={isAccomplished} key={index} transition="scale">
                {() => (
                  <div className={`transitionStep ${isAccomplished ? "accomplished" : ""}`}>
                    <img
                      className="bg-white p-1 icon-svg mt-3"
                      src={iconDetails.icon}
                      width={width}
                      alt="Status Icon"
                    />
                    <div className="mt-2 progress-description">
                      <b>{status.name}</b>
                    </div>
                  </div>
                )}
              </Step>
            );
          })}
        </ProgressBar>
      </div>
      {/* <div className="d-flex justify-content-between">
        {isTournamentAdmin && statusLookupDictionary[tournamentStatusID].previousStatusID && (
          <ProgressTournament
            newTournamentStatus={statusLookupDictionary[tournamentStatusID].previousStatusID}
            tournamentID={tournamentID}
            buttonText={statusLookupDictionary[tournamentStatusID].regressBtnText}
            navigateRoute={statusLookupDictionary[tournamentStatusID].regressNavigateRoute}
            isProgression={false}
          />
        )}
        {isTournamentAdmin && !statusLookupDictionary[tournamentStatusID].previousStatusID && <div></div>}
        {isTournamentAdmin && statusLookupDictionary[tournamentStatusID].nextStatusID && (
          <ProgressTournament
            newTournamentStatus={statusLookupDictionary[tournamentStatusID].nextStatusID}
            tournamentID={tournamentID}
            buttonText={statusLookupDictionary[tournamentStatusID].progressBtnTxt}
            navigateRoute={statusLookupDictionary[tournamentStatusID].progressNavigateRoute}
            isProgression={true}
          />
        )}
      </div> */}
    </div>
  );
};

const ProgressTournament = ({ newTournamentStatus, tournamentID, buttonText, navigateRoute, isProgression }) => {
  const [updateTournamentStatus] = useUpdateTournamentStatusMutation();
  const navigate = useNavigate();
  const location = useLocation();

  let progressTournament = () => {
    // When isProgression is false, show a warning dialog
    if (!isProgression) {
      const isConfirmed = window.confirm("Regressing tournament may affect tournament data. Do you want to continue?");
      if (!isConfirmed) {
        // If the user cancels, simply return and do nothing
        return;
      }
    }

    updateTournamentStatus({ TournamentID: tournamentID, StatusID: newTournamentStatus });
    navigate(location.pathname + navigateRoute);
  };

  return (
    <button className={`btn ${isProgression ? "btn-success" : "btn-danger"}`} onClick={progressTournament}>
      {buttonText}
    </button>
  );
};
