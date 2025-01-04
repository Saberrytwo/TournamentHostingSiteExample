import { Loader } from "@aws-amplify/ui-react";
import { faChevronLeft, faCopy, faEye, faPencil, faRankingStar, faWater } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import {
  useListRegistrationsForTournamentQuery,
  useListTournamentDivisionsQuery,
  useUpdateTournamentStatusMutation,
} from "../../store/apis/tournamentApi";
import "./TournamentAdminDetails.css";

const TournamentAdminDetails = ({ setViewAdminDetails, tournamentDetails }) => {
  const navigate = useNavigate();
  const closePublishModal = () => setShowUnpublishWarning(false);
  const closePoolsModal = () => setShowPoolsWarning(false);
  const closeBracketModal = () => setShowBracketWarning(false);
  const [showUnpublishWarning, setShowUnpublishWarning] = useState(false);
  const [showPoolsWarning, setShowPoolsWarning] = useState(false);
  const [showBracketWarning, setShowBracketWarning] = useState(false);
  const [updateTournamentStatus] = useUpdateTournamentStatusMutation();
  const { tournamentID } = useParams();
  const { data: divisions } = useListTournamentDivisionsQuery({ TournamentID: parseInt(tournamentID!) });
  const { data, isLoading } = useListRegistrationsForTournamentQuery({
    TournamentID: parseInt(tournamentID!),
  });
  const tournamentStatusID = tournamentDetails.item3?.id;
  const currentDate = new Date();
  const startDate = new Date(tournamentDetails.item1?.startDate);
  const differenceInTime = startDate.getTime() - currentDate.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  console.log("tournamentDetails", tournamentDetails);

  async function copyToClipboard(text: string): Promise<void> {
    try {
      if ("clipboard" in navigator) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error("Failed to copy text to clipboard:", error);
    }
  }

  function publishTournament() {
    if (tournamentStatusID === 10) {
      updateTournamentStatus({ TournamentID: parseInt(tournamentID), StatusID: 20 });
    } else {
      toast.warn("This tournament is already published", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  }

  console.log(divisions);

  if (isLoading) return <Loader />;

  return (
    <div className="page-container">
      <div className="d-flex admin-tournament-details flex-column">
        <div className="role-button">
          <button onClick={() => setViewAdminDetails(false)} className="btn d-flex flex-row gap-1 align-items-center">
            <FontAwesomeIcon icon={faEye} />
            Return to player view
          </button>
        </div>
        <div>
          <button
            className="btn align-items-center d-flex flex-row gap-1 back-button-discovery"
            onClick={() => navigate(`/`)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
            Tournament Discovery
          </button>
        </div>
        <h2>{tournamentDetails.item1.tournamentTitle}</h2>
        <h4>Admin Page</h4>
        <div className="cards-carousel">
          <DashboardAmountCard
            title="Total Teams Registered"
            amount={data.length}
            link={`/tournament/${tournamentID}/teams`}
            linkDescription="View registered teams"
          />
          {differenceInDays > 0 && <DashboardAmountCard title="Days Until Start" amount={differenceInDays} />}
          {differenceInDays <= 0 && (
            <DashboardAmountCard title="Days Since Tournament" amount={Math.abs(differenceInDays)} />
          )}
          <DashboardAmountCard
            title="Generated Revenue"
            amount={`$${
              tournamentDetails.item1?.registrationFee ? tournamentDetails.item1?.registrationFee * data.length : "0"
            }`}
          />
        </div>
        <div className="main-admin-content">
          <div className="to-do-list">
            <h3>To-Do List</h3>
            <ToDoListItem
              title="Update Tournament Details/Publish"
              description="By default, your tournament is unpublished. Update the details and publish it."
              completed={tournamentStatusID >= 20}
              current={tournamentStatusID === 10}
              icon={faPencil}
              prevButton={
                <button
                  className="btn card-button btn-reverse-primary"
                  onClick={() => navigate(`/tournament/${tournamentID}/updatetournament`)}
                >
                  Edit Details
                </button>
              }
              progressButton={
                tournamentStatusID === 10 ? (
                  <button className="btn card-button card-action" onClick={() => publishTournament()}>
                    Publish
                  </button>
                ) : (
                  data.length === 0 && (
                    <button className="btn card-button btn-danger" onClick={() => setShowUnpublishWarning(true)}>
                      Unpublish
                    </button>
                  )
                )
              }
            />
            <ToDoListItem
              title="Set Pools"
              description="Set pools for the published tournament. This is required for the tournament to start, but you cannot submit them until registration is closed."
              completed={tournamentStatusID >= 30}
              current={tournamentStatusID >= 20 && tournamentStatusID < 30}
              icon={faWater}
              prevButton={
                <button
                  className="btn card-button btn-reverse-primary"
                  {...(tournamentStatusID < 20 && { disabled: true })}
                  onClick={
                    tournamentStatusID > 20
                      ? () => {
                          navigate("pool/" + divisions[0].tournamentDivisionID);
                        }
                      : tournamentStatusID === 20
                      ? () => {
                          navigate(`/tournament/${tournamentID}/pools/${divisions[0].tournamentDivisionID}`);
                        }
                      : () => {}
                  }
                >
                  {tournamentStatusID > 20 ? "View Pools" : "Set Pools"}
                </button>
              }
              progressButton={
                tournamentStatusID > 20 ? (
                  <button className="btn card-button btn-danger" onClick={() => setShowPoolsWarning(true)}>
                    Reset Pools
                  </button>
                ) : (
                  ""
                )
              }
            />
            <ToDoListItem
              title="Set Bracket"
              description="Set bracket for the tournament. This will be available as soon as pool play is complete. You can set the bracket manually or let the system generate it for you."
              completed={tournamentStatusID >= 40}
              current={tournamentStatusID >= 30 && tournamentStatusID < 40}
              icon={faRankingStar}
              prevButton={
                <button
                  className="btn card-button btn-reverse-primary"
                  {...(tournamentStatusID < 30 && { disabled: true })}
                  onClick={
                    tournamentStatusID > 30
                      ? () => {
                          navigate(`/tournament/${tournamentID}/bracket/${divisions[0].tournamentDivisionID}`);
                        }
                      : tournamentStatusID === 30
                      ? () => {
                          navigate(`/tournament/${tournamentID}/bracketseeder/${divisions[0].tournamentDivisionID}`);
                        }
                      : () => {}
                  }
                >
                  {tournamentStatusID > 30 ? "View Bracket" : "Set Bracket"}
                </button>
              }
              progressButton={
                tournamentStatusID > 30 ? (
                  <button className="btn card-button btn-danger" onClick={() => setShowBracketWarning(true)}>
                    Reset Bracket
                  </button>
                ) : (
                  ""
                )
              }
            />
          </div>
          <div className="right-main">
            <div className="d-flex flex-column">
              <h3>Share</h3>
              <div className="event-link-container d-flex flex-column align-items-start">
                <div className="event-link">
                  <div className="copy-update-label">{window.location.origin + "/tournament/" + tournamentID}</div>
                </div>
                <div className="icon-button">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(window.location.origin + "/tournament/" + tournamentID)}
                  >
                    <span>Copy link</span>
                    <FontAwesomeIcon icon={faCopy} className="copy-icon"></FontAwesomeIcon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          className={`modal fade ${showPoolsWarning ? "show" : ""}`}
          id="exampleModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden={!showPoolsWarning}
          style={{ display: showPoolsWarning ? "block" : "none" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Data Loss Confirmation
                </h5>
                <button
                  type="button"
                  className="button"
                  onClick={closePoolsModal}
                  aria-label="Close"
                  id="closeModalIcon"
                >
                  <div className="close-icon" aria-hidden="true">
                    &times;
                  </div>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <p>
                    Are you sure you want to reset the pools for this tournament? All progress will be lost from past
                    this stage.
                  </p>
                  <div className="d-flex flex-row justify-content-between">
                    <button type="button" className="btn btn-secondary" onClick={closePoolsModal}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        updateTournamentStatus({ TournamentID: parseInt(tournamentID), StatusID: 20 });
                        closePoolsModal();
                      }}
                    >
                      Reset Pools
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showPoolsWarning && <div className="modal-backdrop show" onClick={closePoolsModal}></div>}
      </div>
      <div>
        <div
          className={`modal fade ${showBracketWarning ? "show" : ""}`}
          id="exampleModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden={!showBracketWarning}
          style={{ display: showBracketWarning ? "block" : "none" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Data Loss Confirmation
                </h5>
                <button
                  type="button"
                  className="button"
                  onClick={closeBracketModal}
                  aria-label="Close"
                  id="closeModalIcon"
                >
                  <div className="close-icon" aria-hidden="true">
                    &times;
                  </div>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <p>Are you sure you want to reset the bracket? Any seeding you have made will be lost.</p>
                  <div className="d-flex flex-row justify-content-between">
                    <button type="button" className="btn btn-secondary" onClick={closeBracketModal}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        updateTournamentStatus({ TournamentID: parseInt(tournamentID), StatusID: 30 });
                        closeBracketModal();
                      }}
                    >
                      Reset Bracket
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showBracketWarning && <div className="modal-backdrop show" onClick={closeBracketModal}></div>}
      </div>
      <div>
        <div
          className={`modal fade ${showUnpublishWarning ? "show" : ""}`}
          id="exampleModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden={!showUnpublishWarning}
          style={{ display: showUnpublishWarning ? "block" : "none" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Data Loss Confirmation
                </h5>
                <button
                  type="button"
                  className="button"
                  onClick={closePublishModal}
                  aria-label="Close"
                  id="closeModalIcon"
                >
                  <div className="close-icon" aria-hidden="true">
                    &times;
                  </div>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <p>Are you sure you want to unpublish this tournament? It will be removed from the public view.</p>
                  <div className="d-flex flex-row justify-content-between">
                    <button type="button" className="btn btn-secondary" onClick={closePublishModal}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        updateTournamentStatus({ TournamentID: parseInt(tournamentID), StatusID: 10 });
                        closePublishModal();
                      }}
                    >
                      Unpublish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showUnpublishWarning && <div className="modal-backdrop show" onClick={closePublishModal}></div>}
      </div>
    </div>
  );
};
export default TournamentAdminDetails;

interface CardProps {
  title: string;
  amount: string | number;
  link?: string;
  linkDescription?: string;
}

const DashboardAmountCard = ({ title, amount, link, linkDescription }: CardProps) => {
  const navigate = useNavigate();
  return (
    <div className="dashboard-amount-card eds-l-mar-all-3">
      <div className="eds-l-pad-vert-3 eds-l-pad-hor-5 my-auto d-flex flex-column">
        <h6>{title}</h6>
        <h3>{amount}</h3>
        {link && linkDescription && (
          <div className="card-link" onClick={() => navigate(link)}>
            {linkDescription}
          </div>
        )}
      </div>
    </div>
  );
};

const ToDoListItem = ({
  title,
  description,
  completed,
  current,
  icon,
  prevButton,
  progressButton,
}: {
  title: any;
  description: any;
  completed: any;
  current: any;
  icon: any;
  prevButton?: any;
  progressButton?: any;
}) => {
  const navigate = useNavigate();

  return (
    <div className="to-do-list-item">
      <div className="card w-100">
        <div className={`card-body ${!current && !completed ? "text-secondary" : ""}`}>
          <div className="d-flex flex-row gap-2 justify-content-start">
            <FontAwesomeIcon icon={icon} className="to-do-list-icon" />
            <h5 className={`card-title ${completed || current ? "text-gameset-primary-blue" : "text-muted"}`}>
              {title}
            </h5>
          </div>
          <div className="d-flex flex-row">
            {completed && <span className="badge bg-success bg-gradient fw-normal">Completed</span>}
            {current && <span className="badge bg-warning bg-gradient fw-normal">Current</span>}
          </div>
          <p className="card-text">{description}</p>
          <div className="to-do-button-container d-flex flex-row align-items-center justify-content-between">
            {prevButton && prevButton}
            {progressButton && progressButton}
          </div>
        </div>
      </div>
    </div>
  );
};
