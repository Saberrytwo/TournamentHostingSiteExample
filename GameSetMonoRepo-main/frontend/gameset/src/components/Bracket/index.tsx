import { Button, Loader, useAuthenticator } from "@aws-amplify/ui-react";
import { SingleEliminationBracket, createTheme } from "@g-loot/react-tournament-brackets";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useCreateBracketMutation,
  useListMatchesForTournamentDivisionQuery,
  useListTournamentAdminsQuery,
  useSetScoreForMatchMutation,
} from "../../store/apis/tournamentApi";
import Match from "../Match";
import "./index.css";

interface Participant {
  id: number;
  resultText: string | undefined;
  isWinner: boolean | null;
  status: string | null;
  name: string;
}

interface BracketMatch {
  id: number;
  name: string;
  nextMatchId: number | null;
  tournamentRoundText: string;
  startTime: string;
  state: string;
  participants: Participant[];
}

export const SingleElimination = () => {
  const closeModal = () => setShowScore(false);
  const [showScore, setShowScore] = useState(false);
  const [matchID, setMatchID] = useState(0);
  const [bracketMatches, setBracketMatches] = useState<BracketMatch[]>();
  const [participant1, setParticipant1] = useState<Participant>();
  const [participant2, setParticipant2] = useState<Participant>();
  const [score1, setScore1] = useState<string>();
  const [score2, setScore2] = useState<string>();
  const { user } = useAuthenticator((context) => [context.user]);
  let { tournamentdivisionID } = useParams();

  const TournamentDivisionID = parseInt(tournamentdivisionID!);
  const { data: matches, isLoading } = useListMatchesForTournamentDivisionQuery({ TournamentDivisionID });
  const { data: tourneyAdmins, isLoading: adminsLoading } = useListTournamentAdminsQuery({
    TournamentID: Number(tournamentdivisionID),
  });

  useEffect(() => {
    let bracketMatches = new Array<BracketMatch>();
    let nextMatchCount = 0;
    let isFirstRound = true;
    let firstRoundNumber = matches !== undefined && matches[0] ? matches[0].roundNumber : 0;
    let nullIDCounter = -1;

    matches?.forEach((x) => {
      isFirstRound = x.roundNumber === firstRoundNumber;
      let currMatch = {
        id: x.matchNumber,
        name: "",
        nextMatchId: x.roundNumber === 2 ? null : x.matchNumber + (matches.length + 1) / 2 - Math.round(nextMatchCount),
        tournamentRoundText: "of " + x.roundNumber.toString(),
        startTime: "",
        state: x.registrationID1 === null || x.registrationID2 === null ? "BYE" : "DONE",
        participants: [
          {
            id: x.registrationID1 ?? nullIDCounter--,
            resultText:
              x.registrationID2 === null && x.registrationID1 !== null && isFirstRound
                ? "BYE"
                : x.registrationID1 === null && x.registrationID2 !== null && isFirstRound
                ? "-"
                : x.score1?.toString() ?? undefined,
            isWinner:
              (x.registrationID2 === null && isFirstRound) ||
              (x.registrationID1 !== null && (x.score1 ?? 0) >= (x.score2 ?? 0)),
            status: null,
            name: x.registration1 != null ? x.registration1.team.teamName : "\u00a0",
          },
          {
            id: x.registrationID2 ?? nullIDCounter--,
            resultText:
              x.registrationID2 === null && x.registrationID1 !== null && isFirstRound
                ? "-"
                : x.registrationID1 === null && x.registrationID2 !== null && isFirstRound
                ? "BYE"
                : x.score2?.toString() ?? undefined,
            isWinner:
              (x.registrationID1 === null && isFirstRound) ||
              (x.registrationID2 !== null && (x.score1 ?? 0) <= (x.score2 ?? 0)),
            status: null,
            name: x.registration2 != null ? x.registration2.team.teamName : "\u00a0",
          },
        ],
      };
      nextMatchCount += 0.5;
      bracketMatches.push(currMatch);
    });
    setBracketMatches(bracketMatches);
  }, [matches]);

  const [submitScoreEndpoint] = useSetScoreForMatchMutation();
  const [submitting, setSubmitting] = useState(false);
  const submitScore = async () => {
    try {
      setSubmitting(true);

      const formData = {
        matchID: matchID,
        score1: score1 ? parseInt(score1) : null,
        score2: score2 ? parseInt(score2) : null,
      };
      submitScoreEndpoint(formData)
        .unwrap()
        .then(() => {
          setParticipant1(undefined);
          setParticipant2(undefined);
          setShowScore(false);
        })
        .then(() => {
          notifyScoreUpdateSuccess();
        })
        .catch(() => {
          notifyScoreUpdateError();
        });
    } catch (error) {
      toast.error("An error occurred creating your registration", {
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

  const notifyScoreUpdateSuccess = () =>
    toast.success("Match score successfully updated", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notifyScoreUpdateError = () =>
    toast.error("An error occurred while updating match score", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const setScore = (params: { match: BracketMatch; topWon: boolean; bottomWon: boolean; event: any }) => {
    let fullMatch = matches.find((x) => x.matchNumber == params.match.id);
    let team1UserIDs = fullMatch?.registration1?.team?.users?.map((x) => x.userID) ?? [];
    let team2userIDs = fullMatch?.registration2?.team?.users?.map((x) => x.userID) ?? [];
    let tourneyAdminIDs = tourneyAdmins.map((x) => x.userID) ?? [];
    let admissibleIDs = team1UserIDs.concat(team2userIDs).concat(tourneyAdminIDs);
    let admissibleIDSet = new Set(admissibleIDs);
    if (params.match.state !== "BYE" && admissibleIDSet.has(user.userId)) {
      setShowScore(!showScore);
      let match = bracketMatches!.find((x) => x.id == params.match.id);
      let backendMatch = matches?.find((x) => x.matchNumber == params.match.id);
      setMatchID(backendMatch?.matchID!);

      setParticipant1(match?.participants[0]);
      setParticipant2(match?.participants[1]);
      setScore1(match?.participants[0].resultText);
      setScore2(match?.participants[1].resultText);
    }
  };

  const root = document.documentElement;

  const GamesetTheme = createTheme({
    textColor: { main: "#000000", highlighted: "#07090D", lost: "#3E414D" },
    matchBackground: { wonColor: "#D3D3D3", lostColor: "#D3D3D3" },
    score: {
      background: {
        wonColor: getComputedStyle(root).getPropertyValue("--gameset-primary-blue"),
        lostColor: getComputedStyle(root).getPropertyValue("--gameset-primary-blue"),
      },
      text: { highlightedWonColor: "#FFFFFF", highlightedLostColor: "#FFFFFF" },
    },
    border: {
      color: "#A9A9A9",
      highlightedColor: getComputedStyle(root).getPropertyValue("--gameset-primary-blue"),
    },
    roundHeader: {
      backgroundColor: getComputedStyle(root).getPropertyValue("--gameset-primary-blue"),
      fontColor: "#FFFFFF",
    },
    connectorColor: getComputedStyle(root).getPropertyValue("--light-gray"),
    connectorColorHighlight: getComputedStyle(root).getPropertyValue("--gameset-primary-blue"),
    svgBackground: "#FAFAFA",
  });

  const [createBracket] = useCreateBracketMutation();

  return (
    <div className="overflow-bracket">
      {isLoading || bracketMatches?.length === 0 || bracketMatches === undefined ? (
        isLoading ? (
          <Loader />
        ) : (
          <div className="d-flex justify-content-center text-center mx-2 mt-3">
            There are no bracket matches yet. Contact the tournament admin if this is an error.
          </div>
        )
      ) : (
        <SingleEliminationBracket
          matches={bracketMatches}
          theme={GamesetTheme}
          matchComponent={(props: any) => <Match {...props} onMatchClick={setScore} />}
          options={{
            style: {
              roundHeader: {
                backgroundColor: GamesetTheme.roundHeader.backgroundColor,
                fontColor: GamesetTheme.roundHeader.fontColor,
              },
              connectorColor: GamesetTheme.connectorColor,
              connectorColorHighlight: GamesetTheme.connectorColorHighlight,
            },
          }}
        />
      )}
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
                <button type="button" className="button" onClick={closeModal} aria-label="Close" id="closeModalIcon">
                  <div className="close-icon" aria-hidden="true">
                    &times;
                  </div>
                </button>
              </div>
              <div className="modal-body">
                <div className="score-input-container">
                  <label className="score-label" htmlFor="score1">
                    {participant1?.name}:
                  </label>
                  <input
                    className="score-input"
                    type="number"
                    id="score1"
                    value={score1}
                    onChange={(e) => {
                      setScore1(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="score-input-container">
                  <label className="score-label" htmlFor="score2">
                    {participant2?.name}:
                  </label>
                  <input
                    className="score-input"
                    type="number"
                    id="score2"
                    value={score2}
                    onChange={(e) => {
                      setScore2(e.target.value);
                    }}
                  ></input>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary button" onClick={closeModal} id="close-modal-button">
                  Close
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => submitScore()}
                  className="btn btn-primary button"
                  id="save-modal-button"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>

        {showScore && <div className="modal-backdrop show" onClick={closeModal}></div>}
      </div>
    </div>
  );
};
