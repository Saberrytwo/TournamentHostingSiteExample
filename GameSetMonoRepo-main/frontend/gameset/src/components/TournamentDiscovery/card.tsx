import { useEffect, useState } from "react";
import { FaCalendar, FaMapMarkerAlt, FaUsers } from "react-icons/fa"; // Import the necessary icons
import { useNavigate } from "react-router-dom";
import { useListTeamsByUserIDQuery } from "../../store/apis/teamApi";
import "./card.css";

interface CardProps {
  tournament: Tournament;
  registrations: Registration[];
  user: any;
  setBigSearchOn: React.Dispatch<React.SetStateAction<boolean>>;
}
export const Card = ({ tournament, setBigSearchOn, registrations, user }: CardProps) => {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const startDate = new Date(tournament.startDate).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endDate =
    new Date(tournament.endDate).getMonth() == new Date(tournament.startDate).getMonth()
      ? new Date(tournament.endDate).toLocaleString("en-US", { day: "numeric" })
      : new Date(tournament.endDate).toLocaleString("en-US", { month: "short", day: "numeric" });
  const currentDate = new Date();
  const isRegistrationOpen =
    currentDate >= new Date(tournament.registrationStartDate) &&
    currentDate <= new Date(tournament.registrationEndDate);

  const { data: teamData, isLoading: teamLoading } = useListTeamsByUserIDQuery({ UserID: user.userID });

  useEffect(() => {
    if (teamData && !teamLoading) {
      registrations.forEach((reg) => {
        if (teamData.some((x) => x.teamID == reg.teamID)) {
          setIsRegistered(true);
        }
      });
    }
  }, [teamData, teamLoading]);

  return (
    <div
      className="no-styles-button-card clickable"
      onClick={() => {
        navigate(`/tournament/${tournament.tournamentID}`);
        setBigSearchOn(true);
      }}
    >
      <div className="card-container">
        <div className="d-flex flex-column align-items-end position-relative">
          <img
            className="rounded-top-image shadow"
            src={tournament.imageUrl || "/card_default.jpeg"}
            alt="Tournament Image"
            width="95%"
          />
          {isRegistered && <button className="btn btn-reverse-primary btn-sm me-1 image-badge">Registered</button>}
          {!isRegistered && isRegistrationOpen && (
            <button className="btn btn-primary-blue btn-sm me-1 image-badge">Register Now!</button>
          )}
        </div>
        <div className="tournament-card-info">
          <div className="line">
            <p className="my-tournament-title">{tournament.tournamentTitle}</p>
          </div>
          <div className="line">
            <FaMapMarkerAlt />
            <p>
              {tournament.city}, {tournament.state}
            </p>
          </div>
          <div className="line">
            <FaCalendar />
            <p>
              {startDate} - {endDate}
            </p>
          </div>
          <div className="line">
            <FaUsers />
            <p>{registrations.length.toString()} Signups</p>
          </div>
        </div>
      </div>
    </div>
  );
};
