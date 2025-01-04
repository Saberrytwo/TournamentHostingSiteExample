import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logOut } from "../../store/slices/authSlice";
import { SearchType } from "../../types/params/enums";
import { SearchValues } from "../../types/params/params";
import { BigSearch } from "./bigsearch";
import "./index.css";
import { SmallMenuSheet } from "./smallmenusheet";
import { SmallScreenSearch } from "./smallscreensearch";
import { SmallSearchSheet } from "./smallsearchsheet";

interface NavBarProps {
  onSearchChange: (lat: number, lng: number, distance: number, searchType: SearchType) => void;
  bigSearchOn: boolean;
  setBigSearchOn: React.Dispatch<React.SetStateAction<boolean>>;
}
type OutletContextValue = [boolean, React.Dispatch<React.SetStateAction<boolean>>];

export const NavBar = ({ onSearchChange, bigSearchOn, setBigSearchOn }: NavBarProps) => {
  const url = new URL(window.location.href);
  const pathSegments = url.pathname.split("/");
  const page = pathSegments[pathSegments.length - 1].toLowerCase();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //const [isBigSearchVisible, setIsBigSearchVisible] = useState(bigSearchOn);
  const [searchType, setSearchType] = useState(SearchType.General);
  const [smallSheetOn, setSmallSheetOn] = useState(false);
  const [menuSheetOn, setMenuSheetOn] = useState(false);
  const [searchValues, setSearchValues] = useState<SearchValues>({
    lat: 0,
    lng: 0,
    distance: 25,
    searchType: SearchType.General,
    city: "Current Location",
  });
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const myUser = useAppSelector((state) => state.auth.user);

  const handleScroll = () => {
    const isRootPath = location.pathname === "/" || location.pathname.startsWith("/login");
    if (isRootPath) {
      // check if our hidden element is in view, if it is, show the search bar
      const targetElement = document.getElementById("sneakysneak");

      if (targetElement) {
        const targetRect = targetElement.getBoundingClientRect();
        const isTargetInViewport = targetRect.top >= 0 && targetRect.bottom <= window.innerHeight;

        if (isTargetInViewport) {
          showBigSearch();
        } else {
          hideBigSearch();
        }
      }
    }
  };

  useEffect(() => {
    if (bigSearchOn) {
      // Attach the scroll event listener when the component mounts
      window.addEventListener("scroll", handleScroll);

      // Detach the scroll event listener when the component unmounts
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const showBigSearch = (inputBox: string = "location") => {
    setBigSearchOn(true);
    const element = document.getElementById(inputBox);
    if (element != null) {
      element.focus();
    }
  };
  const hideBigSearch = () => {
    setBigSearchOn(false);
  };

  return (
    <div>
      <nav className="d-flex flex-column fixed-top bg-white">
        <div className="d-flex justify-content-between align-items-center pt-3 px-2 max-100vw">
          <a
            className="navbar-brand ms-3 clickable"
            onClick={() => {
              setBigSearchOn(true);
              setSearchValues({
                lat: 0,
                lng: 0,
                distance: 25,
                searchType: SearchType.General,
                city: "Current Location",
              });
              navigate("/");
            }}
          >
            <h1 className="m-0 logo-text">GameSet</h1>
          </a>
          {/* mobile search*/}
          <SmallSearchSheet
            smallSheetOn={smallSheetOn}
            setSmallSheetOn={setSmallSheetOn}
            searchType={searchType}
            setSearchType={setSearchType}
            user={user}
            setSearchValues={setSearchValues}
            searchValues={searchValues}
            onSearchChange={onSearchChange}
          />

          {/* small search */}
          <SmallScreenSearch
            bigSearchOn={bigSearchOn}
            setBigSearchOn={setBigSearchOn}
            smallSheetOn={smallSheetOn}
            setSmallSheetOn={setSmallSheetOn}
            searchValues={searchValues}
            setSearchValues={setSearchValues}
          />
          {/* // big search tabs */}
          <div className={`d-flex small-screen ${bigSearchOn ? "" : "d-none"}`} id="textSearch">
            <a onClick={() => setSearchType(SearchType.General)} className="text-decoration-none nav-tab">
              <span
                className={`tabbing-font ${searchType === SearchType.General ? "text-black fw-bold" : "gray-text"}`}
              >
                Tournaments
              </span>
            </a>
            {user && (
              <>
                <a onClick={() => setSearchType(SearchType.Registration)} className="text-decoration-none nav-tab">
                  <span
                    className={`tabbing-margin tabbing-font ${
                      searchType === SearchType.Registration ? "text-black fw-bold" : "gray-text"
                    }`}
                  >
                    Registrations
                  </span>
                </a>
                <a onClick={() => setSearchType(SearchType.Admin)} className="text-decoration-none nav-tab">
                  <span
                    className={`tabbing-margin tabbing-font ${
                      searchType === SearchType.Admin ? "text-black fw-bold" : "gray-text"
                    }`}
                  >
                    My Tournaments
                  </span>
                </a>
              </>
            )}
          </div>
          <div className="ham-mobile mx-2 clickable">
            <img src="/icons/hamburger.svg" width="40" height="40" onClick={() => setMenuSheetOn(true)} />
          </div>
          <SmallMenuSheet
            setSmallSheetOn={setMenuSheetOn}
            smallSheetOn={menuSheetOn}
            user={user}
            signOut={signOut}
            setBigSearchOn={setBigSearchOn}
            setSearchValues={setSearchValues}
          />
          <div className="d-flex align-items-center not-mobile">
            <div className="dropdown me-3">
              <button
                className="border-0 text-primary-blue bg-white dropdown-toggle big-font"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                + Create
              </button>
              <ul className="dropdown-menu ">
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => {
                      setBigSearchOn(false);
                      setSearchValues({
                        lat: 0,
                        lng: 0,
                        distance: 25,
                        searchType: SearchType.General,
                        city: "Current Location",
                      });
                      navigate("/createtournament");
                    }}
                  >
                    Tournament
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => {
                      setBigSearchOn(false);
                      setSearchValues({
                        lat: 0,
                        lng: 0,
                        distance: 25,
                        searchType: SearchType.General,
                        city: "Current Location",
                      });
                      navigate("/teams/createteam");
                    }}
                  >
                    Team
                  </a>
                </li>
              </ul>
            </div>
            <div className="dropdown">
              <button
                className="border-0 text-primary-blue bg-white dropdown-toggle big-font"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={myUser.imageURL && myUser.imageURL != "" ? myUser.imageURL : "/icons/user.svg"}
                  width="40"
                  height="40"
                  className="me-3 rounded-circle"
                />
              </button>

              {user ? (
                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        setBigSearchOn(false);
                        setSearchValues({
                          lat: 0,
                          lng: 0,
                          distance: 25,
                          searchType: SearchType.General,
                          city: "Current Location",
                        });
                        navigate("/user/profile");
                      }}
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        setBigSearchOn(false);
                        setSearchValues({
                          lat: 0,
                          lng: 0,
                          distance: 25,
                          searchType: SearchType.General,
                          city: "Current Location",
                        });
                        navigate("/teams");
                      }}
                    >
                      Team Portal
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        signOut();
                        dispatch(logOut());
                      }}
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              ) : (
                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        setBigSearchOn(true);
                        setSearchValues({
                          lat: 0,
                          lng: 0,
                          distance: 25,
                          searchType: SearchType.General,
                          city: "Current Location",
                        });
                        navigate("/login");
                      }}
                    >
                      Login
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
        <BigSearch
          onSearchChange={onSearchChange}
          hideBigSearch={hideBigSearch}
          searchType={searchType}
          bigSearchOn={bigSearchOn}
          searchValues={searchValues}
          setSearchValues={setSearchValues}
        />
        <div className="w-100 mt-3 blue-bar"></div>
      </nav>
      <div id="sneakysneak" className="py-3 my-2"></div>
      <br />
    </div>
  );
};
