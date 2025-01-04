import { Loader, useAuthenticator } from "@aws-amplify/ui-react";
import { faChevronDown, faChevronLeft, faChevronUp, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Amplify } from "aws-amplify";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import awsExports from "../../aws-exports";
import { useAppSelector } from "../../hooks/hooks";
import {
  useDeleteRegistrationByUserIDAndTournamentIDMutation,
  useGetTournamentDetailsQuery,
  useListUsersByTournamentIDQuery,
} from "../../store/apis/tournamentApi";
import { BasicMap } from "../Map";
import { TournamentProgressBar } from "../TournamentProgressBar";
import TournamentAdminDetails from "./TournamentAdminDetails";
import "./index.css";
Amplify.configure(awsExports);

export const TournamentDetails = () => {
  const navigate = useNavigate();
  const { tournamentID } = useParams();
  const { data, isLoading } = useGetTournamentDetailsQuery({ TournamentID: parseInt(tournamentID!) });
  const { user } = useAuthenticator((context) => [context.user]);
  const [isTournamentAdmin, setIsTournamentAdmin] = useState<boolean>(undefined);
  const [viewAdminDetails, setViewAdminDetails] = useState<boolean>(undefined);

  useEffect(() => {
    if (data && data.item2) {
      const isUserTournamentAdmin = data.item2.some((x) => x.userID === user?.userId);
      setIsTournamentAdmin(isUserTournamentAdmin);
      setViewAdminDetails(isUserTournamentAdmin);
    }
  }, [data, user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading || !data || viewAdminDetails === undefined) return <Loader />;

  if (data) {
    const latitude = data.item1.latitude;
    const longitude = data.item1.longitude;
    if (viewAdminDetails === true) {
      return (
        <div className="d-flex flex-column justify-content-center">
          <TournamentAdminDetails setViewAdminDetails={setViewAdminDetails} tournamentDetails={data} />
        </div>
      );
    } else if (viewAdminDetails === false) {
      return (
        <div className=" d-flex flex-row justify-content-center">
          <div className={`tournament-details d-flex ${isTournamentAdmin ? "extra-top-padding" : ""}`}>
            {isTournamentAdmin && (
              <div className="role-button">
                <button
                  onClick={() => setViewAdminDetails(true)}
                  className="btn d-flex flex-row gap-1 align-items-center"
                >
                  <FontAwesomeIcon icon={faEye} />
                  Return to admin view
                </button>
              </div>
            )}
            <div>
              <button
                className="btn align-items-center d-flex flex-row gap-1 back-button-discovery"
                onClick={() => navigate(`/`)}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
                Tournament Discovery
              </button>
            </div>

            <TournamentProgressBar
              tournamentStatusID={data.item1.tournamentStatusId}
              isTournamentAdmin={isTournamentAdmin}
              tournamentID={data.item1.tournamentID}
            />
            <div className="tournament-info-map-container">
              <TournamentInfoTake2 data={data} latitude={latitude} longitude={longitude} />
            </div>
          </div>
        </div>
      );
    }
  }
  return <Loader />;
};

interface DataGroupInterface {
  label: string;
  value: any;
  className?: string;
}

const TournamentMap = ({ latitude, longitude, data }: { latitude: number; longitude: number; data: any }) => {
  return (
    <div className="tournament-map">
      <BasicMap latitude={latitude} longitude={longitude} data={data} />
    </div>
  );
};

const TournamentInfoTake2 = ({ data, latitude, longitude }: any) => {
  const navigate = useNavigate();
  const { tournamentID } = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const { data: allUsers, isLoading: usersLoading } = useListUsersByTournamentIDQuery({
    TournamentID: Number(tournamentID),
  });
  const [isMapVisible, setIsMapVisible] = useState(false);

  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };
  const [isRegistered, setIsRegistered] = useState(false);
  const tournamentTitle = data.item1.tournamentTitle;
  const address = [data.item1.address1, data.item1.city, data.item1.state, data.item1.zipcode].join(", ");
  const startDate = new Date(data.item1.registrationStartDate).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const endDate = new Date(data.item1.registrationEndDate).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const registrationStartDate = new Date(data.item1.registrationStartDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const registrationEndDate = new Date(data.item1.registrationEndDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const currentDate = new Date();
  const isRegistrationOpen =
    currentDate >= new Date(data.item1.registrationStartDate) &&
    currentDate <= new Date(data.item1.registrationEndDate);

  useEffect(() => {
    if (user && allUsers) {
      const userExists = allUsers.some((x) => x.userID === user?.userID);
      userExists ? setIsRegistered(true) : setIsRegistered(false);
    }
  }, [user, allUsers]);

  const [deleteReg] = useDeleteRegistrationByUserIDAndTournamentIDMutation();

  const cancelRegistration = () => {
    const r = confirm(
      "Are you sure you want to cancel your registration? This cannot be undone and you will have to register for the tournament again."
    );

    if (r) {
      deleteReg({ TournamentID: Number(tournamentID), UserID: user?.userID })
        .unwrap()
        .then(() => {
          notifyUnregisterSuccess();
          setIsRegistered(false);
        })
        .catch(() => {
          notifyUnregisterError();
        });
    }
  };

  const notifyUnregisterSuccess = () =>
    toast.success("Successfully unregistered for tournament", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notifyUnregisterError = () =>
    toast.error("An error occurred while unregistering", {
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
    <div className="page-container">
      <DetailsContainer>
        <DetailsGroup>
          <DetailsRow className="image-row">
            <img
              className="rounded-tournament-image"
              src={data.item1.imageUrl || "/card_default.jpeg"}
              alt="Tournament Image"
            />
            <div className="registration">
              <div className="registration-details">
                <h1>{tournamentTitle}</h1>{" "}
                <DataGroup label="Registration Open" value={`${registrationStartDate} - ${registrationEndDate}`} />
              </div>
              {!usersLoading && isRegistrationOpen ? (
                <div className="reg-button-container">
                  {!isRegistered ? (
                    <div className="d-flex">
                      <button
                        type="button"
                        className="register-button btn btn-primary-blue mx-2"
                        onClick={() => navigate("register")}
                      >
                        Register Now!
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex flex-column">
                      <div className="mb-2">You are already registered for this tournament.</div>
                      {data.item1.tournamentStatusId < 30 && (
                        <button
                          type="button"
                          className="register-button btn btn-danger"
                          onClick={() => cancelRegistration()}
                        >
                          Cancel Registration
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="reg-button-container">
                  <div className="d-flex align-items-center">
                    <div className="mb-2 text-danger registration-closed">Registration is currently closed.</div>
                  </div>
                </div>
              )}
            </div>
          </DetailsRow>
        </DetailsGroup>
        <DetailsGroup title="Tournament Details">
          <DetailsRow>
            <DataGroup label="Tournament Dates" value={`${startDate} - ${endDate}`} />
          </DetailsRow>
          <DetailsRow className="address-container">
            <DataGroup label="Address" value={address} />
            <button type="button" className="btn map-toggle" onClick={toggleMapVisibility}>
              {isMapVisible ? (
                <>
                  Hide Map <FontAwesomeIcon icon={faChevronUp} />
                </>
              ) : (
                <>
                  Show Map <FontAwesomeIcon icon={faChevronDown} />
                </>
              )}
            </button>
          </DetailsRow>
          {isMapVisible && (
            <div className="map-container">
              <TournamentMap latitude={latitude} longitude={longitude} data={data} />
            </div>
          )}
          <DetailsRow className="justify-content-between">
            <DataGroup label="Details" value={parse(data.item1.description)} />
          </DetailsRow>
        </DetailsGroup>
        <DetailsGroup title="Divisions">
          <DetailsRow>{data.item4.map((division: any) => DivisionContainer(division))}</DetailsRow>
        </DetailsGroup>
      </DetailsContainer>
    </div>
  );
};

const DataGroup = ({ label, value, className = "" }: DataGroupInterface) => {
  return (
    <div className={`$data-group ${className}`}>
      <div className="data-label">{label}</div>
      <div className="data-value">{value}</div>
    </div>
  );
};

interface DetailsContainerProps {
  children: React.ReactNode;
}

function DetailsContainer({ children }: DetailsContainerProps) {
  return <div className="details-container">{children}</div>;
}

interface DetailsGroupProps {
  title?: string;
  children: React.ReactNode;
}

function DetailsGroup({ title, children }: DetailsGroupProps) {
  return (
    <div className="details-group">
      {title && <h3>{title}</h3>}
      <div className="details-items">
        {React.Children.map(children, (child, index) => (
          <div key={index} className="details-item">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

interface DetailsRowProps {
  children: React.ReactNode;
  className?: string;
}

function DetailsRow({ children, className }: DetailsRowProps) {
  return <div className={`details-row ${className || ""}`}>{children}</div>;
}

function DivisionContainer(division: any) {
  return (
    <div key={division.divisionID} className="division-container">
      {division.divisionName}
    </div>
  );
}
