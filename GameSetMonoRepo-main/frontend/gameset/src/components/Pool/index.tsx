import { Loader, useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useListGroupsByTournamentDivisionIDQuery,
  useListPoolPlayMatchesQuery,
  useListTournamentAdminsQuery,
  useListTournamentDivisionsQuery,
  useSetScoreForMatchMutation,
} from "../../store/apis/tournamentApi";
import "./index.css";
import PoolPlayMatch from "./poolPlayMatch";

export const Pool = () => {
  const closeModal = () => setShowScore(false);
  const { tournamentID, tournamentdivisionID } = useParams();
  const [showScore, setShowScore] = useState(false);
  const [score1, setScore1] = useState<number>();
  const [score2, setScore2] = useState<number>();
  const [filter, setFilter] = useState("Group");
  const [teamFilter, setTeamFilter] = useState<number>();
  const [groupFilter, setGroupFilter] = useState<string>();
  const [filteredMatches, setFilteredMatches] = useState<Match[]>();
  const [teamData, setTeamData] = useState<teamData[]>();
  const [groupedTeamData, setGroupedTeamData] = useState<groupsTeamData[]>();
  const [groupedTeamDataLoading, setGroupedTeamDataLoading] = useState(true);
  const [match, setMatch] = useState<Match>();
  const [matchID, setMatchID] = useState(0);
  const { user } = useAuthenticator((context) => [context.user]);

  const { data: divisionMatches, isLoading: divisionMatchesLoading } = useListPoolPlayMatchesQuery({
    TournamentDivisionID: Number(tournamentdivisionID),
  });

  const { data: divisionGroups, isLoading: groupsLoading } = useListGroupsByTournamentDivisionIDQuery({
    TournamentDivisionID: Number(tournamentdivisionID),
  });

  const { data: tournamentDivisions, isLoading: divisionNameLoading } = useListTournamentDivisionsQuery({
    TournamentID: Number(tournamentID),
  });

  useEffect(() => {
    if (divisionMatches === undefined) return;

    setFilteredMatches(
      divisionMatches.filter((x) => x.registration1.groupID === groupFilter || x.registration2.groupID === groupFilter)
    );
  }, [groupFilter, divisionMatches]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (divisionMatches === undefined) return;

    setFilteredMatches(
      divisionMatches.filter((x) => x.registrationID1 === teamFilter || x.registrationID2 === teamFilter)
    );
  }, [teamFilter, divisionMatches]);

  useEffect(() => {
    if (divisionMatchesLoading) return;

    let teamDataDictionary = {};
    let updatedTeamData = [];

    divisionMatches.forEach((match) => {
      const { registration1, registration2, score1, score2 } = match;

      if (teamDataDictionary.hasOwnProperty(registration1.registrationID)) {
        const team = teamDataDictionary[registration1.registrationID];
        team.wins += score1 > score2 ? 1 : 0;
        team.draws += score1 == score2 && score1 !== null && score2 !== null ? 1 : 0;
        team.losses += score1 < score2 ? 1 : 0;
        team.pointsFor += score1;
        team.pointsAgainst += score2;
        team.pointDifference = team.pointsFor - team.pointsAgainst;
        team.averagePointDifference = team.pointDifference / (team.wins + team.losses);
      } else {
        teamDataDictionary[registration1.registrationID] = {
          id: registration1.registrationID,
          groupID: registration1.groupID ?? "",
          teamName: registration1.team.teamName,
          wins: score1 > score2 ? 1 : 0,
          draws: score1 == score2 && score1 !== null && score2 !== null ? 1 : 0,
          losses: score1 < score2 ? 1 : 0,
          pointsFor: score1,
          pointsAgainst: score2,
          pointDifference: score1 - score2,
          averagePointDifference: score1 - score2,
        };
      }

      if (teamDataDictionary.hasOwnProperty(registration2.registrationID)) {
        const team = teamDataDictionary[registration2.registrationID];
        team.wins += score2 > score1 ? 1 : 0;
        team.draws += score1 == score2 && score1 !== null && score2 !== null ? 1 : 0;
        team.losses += score2 < score1 ? 1 : 0;
        team.pointsFor += score2;
        team.pointsAgainst += score1;
        team.pointDifference = team.pointsFor - team.pointsAgainst;
        team.averagePointDifference = team.pointDifference / (team.wins + team.losses);
      } else {
        teamDataDictionary[registration2.registrationID] = {
          id: registration2.registrationID,
          groupID: registration2.groupID ?? "",
          teamName: registration2.team.teamName,
          wins: score2 > score1 ? 1 : 0,
          draws: score1 == score2 && score1 !== null && score2 !== null ? 1 : 0,
          losses: score2 < score1 ? 1 : 0,
          pointsFor: score2,
          pointsAgainst: score1,
          pointDifference: score2 - score1,
          averagePointDifference: score2 - score1,
        };
      }
    });
    updatedTeamData = Object.values(teamDataDictionary);
    updatedTeamData.sort((a, b) => {
      if (a.losses < b.losses) return -1;
      if (a.losses > b.losses) return 1;

      if (a.averagePointDifference < b.averagePointDifference) return 1;
      if (a.averagePointDifference > b.averagePointDifference) return -1;
    });
    setTeamData(updatedTeamData);
  }, [divisionMatches]);

  useEffect(() => {
    if (groupsLoading || !teamData) return;
    setGroupedTeamDataLoading(true);
    let groupedTeamDictionary = {};
    let updatedGroupedTeamData = [];

    teamData.forEach((team) => {
      if (groupedTeamDictionary.hasOwnProperty(team.groupID)) {
        groupedTeamDictionary[team.groupID].teams.push(team);
      } else {
        groupedTeamDictionary[team.groupID] = {
          groupID: team.groupID,
          groupName: divisionGroups.find((x) => x.groupID === team.groupID).groupName,
          teams: new Array(team),
        };
      }
    });
    updatedGroupedTeamData = Object.values(groupedTeamDictionary);
    updatedGroupedTeamData.forEach((g) => {
      g.teams.sort((a, b) => {
        if (a.losses < b.losses) return -1;
        if (a.losses > b.losses) return 1;

        if (a.averagePointDifference < b.averagePointDifference) return 1;
        if (a.averagePointDifference > b.averagePointDifference) return -1;
      });
    });
    updatedGroupedTeamData.sort((a, b) => a.groupName.localeCompare(b.groupName));

    setGroupedTeamData(updatedGroupedTeamData);
    setGroupedTeamDataLoading(false);
  }, [teamData, groupsLoading]);

  const { data: tourneyAdmins, isLoading: adminsLoading } = useListTournamentAdminsQuery({
    TournamentID: Number(tournamentdivisionID),
  });

  const handleMatchClick = (m: Match, i: number) => {
    let team1UserIDs = m?.registration1?.team?.users?.map((x) => x.userID) ?? [];
    let team2userIDs = m?.registration2?.team?.users?.map((x) => x.userID) ?? [];
    let tourneyAdminIDs = tourneyAdmins.map((x) => x.userID) ?? [];

    let admissibleIDs = team1UserIDs.concat(team2userIDs).concat(tourneyAdminIDs);
    let admissibleIDSet = new Set(admissibleIDs);
    if (admissibleIDSet.has(user.userId)) {
      setMatchID(m.matchID);
      setScore1(m.score1);
      setScore2(m.score2);
      setMatch(m);

      setShowScore(true);
    }
  };

  const [submitScoreEndpoint] = useSetScoreForMatchMutation();
  const [submitting, setSubmitting] = useState(false);
  const [showQL, setShowQL] = useState(false);
  const submitScore = async (e: React.MouseEvent) => {
    try {
      setSubmitting(true);
      const formData = {
        matchID: matchID,
        score1: score1 ? score1 : null,
        score2: score2 ? score2 : null,
      };
      submitScoreEndpoint(formData)
        .unwrap()
        .then(() => {
          setShowScore(false);
          toast.success("Score updated successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        })
        .catch(() => {
          alert("Something went wrong.");
        });
    } catch (error) {
      toast.error("An error occurred during your registration", {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex justify-content-center ">
      <div className={`big-box ${showQL ? "d-none" : ""}`}>
        {tournamentDivisions && (
          <div className="d-flex justify-content-center">
            <h1 className="text-truncate">
              Pool Play -{" "}
              {
                tournamentDivisions.find((x) => x.tournamentDivisionID == Number(tournamentdivisionID)).division
                  .divisionName
              }{" "}
              {groupFilter !== undefined
                ? " - " + groupedTeamData.find((x) => x.groupID === groupFilter).groupName
                : ""}
              {teamFilter !== undefined ? " - " + teamData.find((x) => x.id === teamFilter).teamName : ""}
            </h1>
          </div>
        )}
        <div
          className={
            filteredMatches && Object.keys(filteredMatches).length > 3
              ? "d-flex matches-scroll"
              : "d-flex justify-content-center matches-scroll"
          }
        >
          <div className="scroll-bounding-box">
            {!(filteredMatches === undefined) &&
              filteredMatches.map((m: Match, i) => <PoolPlayMatch onClick={handleMatchClick} key={i} i={i} m={m} />)}
            {(filteredMatches === undefined || filteredMatches.length === 0) &&
              !divisionMatchesLoading &&
              divisionMatches &&
              divisionMatches.map((m: Match, i) => <PoolPlayMatch onClick={handleMatchClick} key={i} i={i} m={m} />)}
          </div>
        </div>
      </div>
      <div className={`bin-box clickable ${!showQL ? "" : "d-none"}`} onClick={() => setShowQL(true)}>
        <img src="/icons/binoculars.svg" width="50" />
      </div>
      <div className={`border-start bg-light lil-box mobile-box ${showQL ? "" : "d-none"}`}>
        <div className="d-flex justify-content-between align-items-center">
          <button type="button" className="btn btn-danger" onClick={() => setShowQL(false)}>
            X
          </button>
          <h2 className="text-center mt-4">Quick Look</h2>
          <span>{"     "}</span>
        </div>
        <div className="d-flex justify-content-center ms-3">
          <div
            className={`clickable border rounded px-3 py-2 filter-div ${filter === "Group" ? "active" : ""}`}
            onClick={() => {
              setFilter("Group");
            }}
          >
            Group
          </div>
          <div
            className={`clickable border rounded px-3 py-2 filter-div ms-2 ${filter === "Division" ? "active" : ""}`}
            onClick={() => {
              setFilter("Division");
            }}
          >
            Division
          </div>
        </div>
        <div className="mt-3">
          {filter === "Group" ? (
            <div className="quick-padding">
              {groupedTeamDataLoading ? (
                <Loader />
              ) : (
                groupedTeamData.map((group, index) => (
                  <div className="mt-3" key={index}>
                    <div className="quick-grid">
                      <h2
                        className={
                          "mb-0 clickable group-row" + (group.groupID === groupFilter ? " team-row-selected" : "")
                        }
                        onClick={() => {
                          setShowQL(false);
                          setTeamFilter(undefined);
                          groupFilter === group.groupID ? setGroupFilter(undefined) : setGroupFilter(group.groupID);
                        }}
                      >
                        {group.groupName}
                      </h2>
                      <span className="header-text">W</span>
                      <span className="header-text">L</span>
                      <span className="header-text">D</span>
                      <span className="header-text">PF</span>
                      <span className="header-text">PA</span>
                      <span className="header-text">PD</span>
                    </div>

                    {group.teams.map((team, index) => (
                      <div
                        key={index}
                        className={
                          "quick-grid p-1 team-row clickable " + (team.id === teamFilter ? "team-row-selected" : "")
                        }
                        onClick={() => {
                          setShowQL(false);
                          setGroupFilter(undefined);
                          teamFilter === team.id ? setTeamFilter(undefined) : setTeamFilter(team.id);
                        }}
                      >
                        <span className="mb-0 team-text ps-1">{team.teamName} </span>
                        <span className="score-text">{team.wins}</span>
                        <span className="score-text">{team.losses}</span>
                        <span className="score-text">{team.draws}</span>
                        <span className="score-text">{team.pointsFor}</span>
                        <span className="score-text">{team.pointsAgainst}</span>
                        <span className="score-text">{team.pointDifference}</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="mt-3 px-5">
              <div className="division-grid">
                {tournamentDivisions && (
                  <h2 className="mb-0 clickable group-row two-column">
                    {
                      tournamentDivisions.find((x) => x.tournamentDivisionID == Number(tournamentdivisionID)).division
                        .divisionName
                    }
                  </h2>
                )}
                <span className="header-text">W</span>
                <span className="header-text">L</span>
                <span className="header-text">D</span>
                <span className="header-text">PF</span>
                <span className="header-text">PA</span>
                <span className="header-text">PD</span>
              </div>

              {teamData.map((team, index) => (
                <div
                  key={index}
                  className="division-grid p-1 team-row clickable"
                  onClick={() => {
                    setShowQL(false);
                    setGroupFilter(undefined);
                    teamFilter === team.id ? setTeamFilter(undefined) : setTeamFilter(team.id);
                  }}
                >
                  <span className="score-text rank">{index + 1}</span>
                  <span className="mb-0 team-text ps-1">{team.teamName} </span>
                  <span className="score-text">{team.wins}</span>
                  <span className="score-text">{team.losses}</span>
                  <span className="score-text">{team.draws}</span>
                  <span className="score-text">{team.pointsFor}</span>
                  <span className="score-text">{team.pointsAgainst}</span>
                  <span className="score-text">{team.pointDifference}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={`border-start bg-light lil-box no-mobile-lil`}>
        <h2 className="text-center mt-4">Quick Look</h2>
        <div className="d-flex ms-3">
          <div
            className={`clickable border rounded px-3 py-2 filter-div ${filter === "Group" ? "active" : ""}`}
            onClick={() => {
              setFilter("Group");
            }}
          >
            Group
          </div>
          <div
            className={`clickable border rounded px-3 py-2 filter-div ms-2 ${filter === "Division" ? "active" : ""}`}
            onClick={() => {
              setFilter("Division");
            }}
          >
            Division
          </div>
        </div>
        <div className="mt-3">
          {filter === "Group" ? (
            <div className="quick-padding">
              {groupedTeamDataLoading ? (
                <Loader />
              ) : (
                groupedTeamData.map((group, index) => (
                  <div className="mt-3" key={index}>
                    <div className="quick-grid">
                      <h2
                        className={
                          "mb-0 clickable group-row" + (group.groupID === groupFilter ? " team-row-selected" : "")
                        }
                        onClick={() => {
                          setTeamFilter(undefined);
                          groupFilter === group.groupID ? setGroupFilter(undefined) : setGroupFilter(group.groupID);
                        }}
                      >
                        {group.groupName}
                      </h2>
                      <span className="header-text">W</span>
                      <span className="header-text">L</span>
                      <span className="header-text">D</span>
                      <span className="header-text">PF</span>
                      <span className="header-text">PA</span>
                      <span className="header-text">PD</span>
                    </div>

                    {group.teams.map((team, index) => (
                      <div
                        key={index}
                        className={
                          "quick-grid p-1 team-row clickable " + (team.id === teamFilter ? "team-row-selected" : "")
                        }
                        onClick={() => {
                          setGroupFilter(undefined);
                          teamFilter === team.id ? setTeamFilter(undefined) : setTeamFilter(team.id);
                        }}
                      >
                        <span className="mb-0 team-text ps-1">{team.teamName} </span>
                        <span className="score-text">{team.wins}</span>
                        <span className="score-text">{team.losses}</span>
                        <span className="score-text">{team.draws}</span>
                        <span className="score-text">{team.pointsFor}</span>
                        <span className="score-text">{team.pointsAgainst}</span>
                        <span className="score-text">{team.pointDifference}</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="mt-3 px-5">
              <div className="division-grid">
                {tournamentDivisions && (
                  <h2 className="mb-0 clickable group-row two-column">
                    {
                      tournamentDivisions.find((x) => x.tournamentDivisionID == Number(tournamentdivisionID)).division
                        .divisionName
                    }
                  </h2>
                )}
                <span className="header-text">W</span>
                <span className="header-text">L</span>
                <span className="header-text">D</span>
                <span className="header-text">PF</span>
                <span className="header-text">PA</span>
                <span className="header-text">PD</span>
              </div>

              {teamData.map((team, index) => (
                <div
                  key={index}
                  className="division-grid p-1 team-row clickable"
                  onClick={() => {
                    setGroupFilter(undefined);
                    teamFilter === team.id ? setTeamFilter(undefined) : setTeamFilter(team.id);
                  }}
                >
                  <span className="score-text rank">{index + 1}</span>
                  <span className="mb-0 team-text ps-1">{team.teamName} </span>
                  <span className="score-text">{team.wins}</span>
                  <span className="score-text">{team.losses}</span>
                  <span className="score-text">{team.draws}</span>
                  <span className="score-text">{team.pointsFor}</span>
                  <span className="score-text">{team.pointsAgainst}</span>
                  <span className="score-text">{team.pointDifference}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showScore ? (
        <div>
          <div
            className={`modal fade ${showScore ? "show" : ""}`}
            id="exampleModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden={!showScore}
            style={{ display: showScore ? "block" : "none" }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Enter Score
                  </h5>
                  <button type="button" onClick={closeModal} aria-label="Close" id="closeModalIcon">
                    <div className="close-icon" aria-hidden="true">
                      &times;
                    </div>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="score-input-container">
                    <label className="score-label" htmlFor="score1">
                      {match.registration1?.team.teamName}:
                    </label>
                    <input
                      className="score-input"
                      type="number"
                      id="score1"
                      value={score1 ?? "-"}
                      onChange={(e) => {
                        setScore1(parseInt(e.target.value));
                      }}
                    ></input>
                  </div>
                  <div className="score-input-container">
                    <label className="score-label" htmlFor="score2">
                      {match.registration2.team?.teamName}:
                    </label>
                    <input
                      className="score-input"
                      type="number"
                      id="score2"
                      value={score2 ?? "-"}
                      onChange={(e) => {
                        setScore2(parseInt(e.target.value));
                      }}
                    ></input>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal} id="close-modal-button">
                    Close
                  </button>
                  {/* <button
                    type="button"
                    disabled={submitting}
                    loa
                    onClick={() => submitScore()}
                    className="btn btn-primary"
                    id="save-modal-button"
                  >
                    Save changes
                  </button> */}
                  <button
                    type="button"
                    className="btn btn-primary "
                    id="load1"
                    onClick={(e) => submitScore(e)}
                    data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Saving Changes"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {showScore && <div className="modal-backdrop show" onClick={closeModal}></div>}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Pool;
