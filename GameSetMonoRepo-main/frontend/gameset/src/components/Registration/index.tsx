import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/hooks";
import { useListTeamsByUserIDQuery } from "../../store/apis/teamApi";
import {
  useDeleteRegistrationByUserIDAndTournamentIDMutation,
  useListDivisionsForTournamentQuery,
  useListTournamentByIDQuery,
  useListUsersByTournamentIDQuery,
  useRegisterMutation,
} from "../../store/apis/tournamentApi";
import { Form, FormGroup, FormRow, SelectorInput } from "../Forms/index";
import { Loader } from "../Loader";
import "./index.css";

export const TournamentRegistration = () => {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [regOpen, setRegOpen] = useState(false);
  const { tournamentID } = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const { data: allUsers, isLoading: usersLoading } = useListUsersByTournamentIDQuery({
    TournamentID: Number(tournamentID),
  });
  const { data: myTournament, isLoading: tournamentLoading } = useListTournamentByIDQuery({
    TournamentID: Number(tournamentID),
  });
  const [isRegistered, setIsRegistered] = useState(false);
  useEffect(() => {
    if (user && allUsers) {
      const userExists = allUsers.some((x) => x.userID === user.userID);
      userExists ? setIsRegistered(true) : setIsRegistered(false);
    }
  }, [user, allUsers]);
  useEffect(() => {
    if (myTournament && !tournamentLoading) {
      const currentDate = new Date();
      const isRegistrationOpen =
        currentDate >= new Date(myTournament.registrationStartDate) &&
        currentDate <= new Date(myTournament.registrationEndDate);
      setRegOpen(isRegistrationOpen);
    }
  }, [myTournament, tournamentLoading]);
  const [deleteReg] = useDeleteRegistrationByUserIDAndTournamentIDMutation();

  const cancelRegistration = () => {
    const r = confirm(
      "Are you sure you want to cancel your registration? This cannot be undone and you will have to register for the tournament again."
    );

    if (r) {
      deleteReg({ TournamentID: Number(tournamentID), UserID: user.userID })
        .unwrap()
        .then(() => {
          alert("Your registration has been deleted");
          setIsRegistered(false);
        })
        .catch(() => {
          alert("There was an error, please try again");
        });
    }
  };

  const { data: tournamentDivisions, isLoading } = useListDivisionsForTournamentQuery({
    TournamentID: Number(tournamentID),
  });
  let items = isLoading
    ? []
    : [
        ...tournamentDivisions!.map((division: Division) => ({
          id: division.divisionID.toString(),
          name: division.divisionName,
        })),
      ];

  const { data: userTeams, isLoading: teamsLoading } = useListTeamsByUserIDQuery({ UserID: user.userID });

  const items2 = teamsLoading
    ? []
    : [
        ...userTeams!.map((team: Team) => ({
          id: team.teamID!.toString(),
          name: team.teamName,
        })),
      ];

  const [currentStep, setCurrentStep] = useState(1);

  const [registerTeam, { isLoading: registerLoading }] = useRegisterMutation();

  const handleNextStep = (step: number) => {
    setCurrentStep(step);
  };
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      let team = userTeams?.find((x) => x.teamID === parseInt(selectedTeam));
      let division = tournamentDivisions?.find((x) => x.divisionID === parseInt(selectedDivision));
      if (team && division && tournamentID) {
        const formData = {
          TeamID: team.teamID!,
          TournamentID: parseInt(tournamentID),
          DivisionID: division.divisionID,
        };
        registerTeam(formData)
          .unwrap()
          .then(() => {
            notifyRegistrationSuccess();
            navigate(`/tournament/${tournamentID}`);
          })
          .catch(() => {
            notifyRegistrationError();
          });
      }
    } catch (error) {
      toast.error("An error occurred during registration.", {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      // Handle error
    } finally {
      setSubmitting(false);
    }
  };

  const notifyRegistrationSuccess = () =>
    toast.success("Successfully registered for tournament", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notifyRegistrationError = () =>
    toast.error("An error occurred while registering for tournament", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  return (
    <>
      {isLoading || usersLoading || teamsLoading || registerLoading || tournamentLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="d-flex justify-content-center">
            <div className="reg-headers">
              <button
                className="btn align-items-center d-flex flex-row gap-1 back-button-discovery"
                onClick={() => navigate(`/tournament/${tournamentID}`)}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
                Tournament Details
              </button>
              <h1 className="my-3 mt-4">Tournament Registration</h1>
              <div className="opacity-0"> {"← Tournament Details"}</div>
            </div>
          </div>
          {!isRegistered && regOpen && (
            <Form>
              <div
                className="d-flex justify-content-center clickable"
                onClick={
                  currentStep != 1
                    ? () => {
                        handleNextStep(1);
                      }
                    : undefined
                }
              >
                <div className="border rounded reg-75">
                  <FormGroup title="Step 1: Select a Team">
                    {currentStep === 1 && (
                      <>
                        <FormRow>
                          {!isLoading && (
                            <SelectorInput
                              label={"Team"}
                              required={true}
                              options={items2}
                              value={selectedTeam}
                              setValue={setSelectedTeam}
                            />
                          )}
                        </FormRow>
                        <div className="text-center text-secondary mt-2">
                          If you don't have any teams yet, you can create one{" "}
                          <a onClick={() => navigate("/teams/createteam")} className="text-primary-blue">
                            here
                          </a>
                          .
                        </div>
                      </>
                    )}
                  </FormGroup>
                </div>
              </div>
              <div
                className="d-flex justify-content-center mt-3 clickable"
                onClick={
                  currentStep != 2
                    ? () => {
                        handleNextStep(2);
                      }
                    : undefined
                }
              >
                <div className="border rounded reg-75">
                  <FormGroup title="Step 2: Select a Division">
                    {currentStep === 2 && (
                      <FormRow>
                        <SelectorInput
                          label={"Division"}
                          required={true}
                          options={items}
                          value={selectedDivision}
                          setValue={setSelectedDivision}
                        />
                      </FormRow>
                    )}
                  </FormGroup>
                </div>
              </div>

              <div
                className="d-flex justify-content-center mt-3 clickable"
                onClick={
                  currentStep != 3
                    ? () => {
                        handleNextStep(3);
                      }
                    : undefined
                }
              >
                {/* Can add back later, but right now doesn't do anything and it looks weird rn
          <div className="border rounded reg-75">
            <FormGroup title="Step 3: How did you hear about us?">
              {currentStep === 3 && (
                <FormRow>
                  <TextAreaInput label={"How did you hear about us?"} />
                </FormRow>
              )}
            </FormGroup>
            {currentStep === 3 && <div className="pt-5"></div>}
          </div> */}
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button type="button" className="btn btn-primary-blue" onClick={handleSubmit} disabled={submitting}>
                  {" "}
                  Register{" "}
                </button>
              </div>
            </Form>
          )}
          {isRegistered && regOpen && (
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="mb-3 text-center">You are already registered for this tournament.</div>
              <button type="button" className="btn btn-danger" onClick={() => cancelRegistration()}>
                Cancel Registration
              </button>
            </div>
          )}

          {!regOpen && (
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="mb-3 text-center w-75">
                The registration period is currently closed for this tournament. Contact the tournament admin with any
                questions.
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
