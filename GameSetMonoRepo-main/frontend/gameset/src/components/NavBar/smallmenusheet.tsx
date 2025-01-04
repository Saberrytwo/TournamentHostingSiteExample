import { Path, useNavigate } from "react-router-dom";
import { SmallScreenProps } from "../../types/params/params";
import { useAppDispatch } from "../../hooks/hooks";
import { logOut } from "../../store/slices/authSlice";
import { SearchType } from "../../types/params/enums";

export const SmallMenuSheet: React.FC<SmallScreenProps> = ({
  smallSheetOn,
  setSmallSheetOn,
  user,
  signOut,
  setBigSearchOn,
  setSearchValues,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const navigateAndClose = (path: any) => {
    setSmallSheetOn(false);
    setSearchValues({
      lat: 0,
      lng: 0,
      distance: 25,
      searchType: SearchType.General,
      city: "Current Location",
    });
    navigate(path);
  };
  return (
    <div className={`mobile-sheet bg-white ${smallSheetOn ? "sheet-display" : ""}`} id="bigSearch">
      <div className="d-flex m-3 align-items-center justify-content-between">
        <button onClick={() => setSmallSheetOn(false)} className="btn btn-sm x-btn btn-reverse-primary rounded-circle">
          <b className="tabbing-font">{" X "}</b>
        </button>
        <button className="px-2 btn btn-sm rounded-circle opacity-0">{" X "}</button>
      </div>
      <div className="d-flex flex-column align-items-center">
        <h3
          className="mb-0"
          onClick={() => {
            navigateAndClose("/");
          }}
        >
          Home
        </h3>
        <hr className="w-100" />
        <h3
          className="mb-0"
          onClick={() => {
            navigateAndClose("/createtournament");
          }}
        >
          Create Tournament
        </h3>
        <hr className="w-100" />
        <h3
          className="mb-0"
          onClick={() => {
            navigateAndClose("/teams/createteam");
          }}
        >
          Create Team
        </h3>
        <hr className="w-100" />
        {user ? (
          <>
            <h3 className="mb-0" onClick={() => navigateAndClose("/teams")}>
              Team Portal
            </h3>
            <hr className="w-100" />
            <h3 className="mb-0" onClick={() => navigateAndClose("/user/profile")}>
              Profile
            </h3>
            <hr className="w-100" />
            <h3
              className="mb-0"
              onClick={() => {
                signOut();
                dispatch(logOut());
                setSmallSheetOn(false);
              }}
            >
              Logout
            </h3>
            <hr className="w-100" />
          </>
        ) : (
          <>
            <h3
              className="mb-0"
              onClick={() => {
                setBigSearchOn(true);
                navigateAndClose("/login");
              }}
            >
              Login
            </h3>
            <hr className="w-100" />
          </>
        )}
      </div>
    </div>
  );
};
