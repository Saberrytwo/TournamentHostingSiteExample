import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";
import { useListTournamentsQuery } from "../../store/apis/tournamentApi";
import { SearchType } from "../../types/params/enums";
import { SearchValues } from "../../types/params/params";
import { Loader } from "../Loader";
import { Card } from "./card";
import "./index.css";

export const DiscoveryPage = () => {
  const search: [SearchValues] = useOutletContext();
  const navigate = useNavigate();
  const setBigSearchOn: React.Dispatch<React.SetStateAction<boolean>> = useOutletContext();

  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [currLat, setCurrLat] = useState<number>(0);
  const [currLng, setCurrLng] = useState<number>(0);
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [distance, setDistance] = useState<number>(25);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.General);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setCurrLat(latitude);
      setCurrLng(longitude);
      setLat(latitude);
      setLng(longitude);
    });
  }, [initialLoad]);

  useEffect(() => {
    if (search[0].lat === 0 && search[0].lng === 0 && searchType) {
      setLat(currLat);
      setLng(currLng);
    } else if (search[0].lat !== 0 && search[0].lng !== 0) {
      setLat(search[0].lat);
      setLng(search[0].lng);
    }
    setDistance(search[0].distance);
    setSearchType(search[0].searchType);
  }, [search]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setCurrLat(latitude);
      setCurrLng(longitude);
    });
  }, [initialLoad]);

  const { data, isLoading } = useListTournamentsQuery({
    lat: lat,
    lng: lng,
    distance,
    searchType: searchType,
    userID: user.userID,
  });

  const { data: featuredTourneyData, isLoading: featuredTourneyDataIsLoading } = useListTournamentsQuery({
    lat: currLat,
    lng: currLng,
    distance: distance,
    searchType: SearchType.Featured,
    userID: user.userID,
  });
  const currentDate = new Date();
  const tournaments = isLoading
    ? undefined
    : searchType === SearchType.General
    ? data.tournaments.filter((tournament) => {
        const tournamentStartDate = new Date(tournament.startDate).getDate();
        const tournamentEndDate = new Date(tournament.endDate).getDate();

        return currentDate.getDate() <= tournamentEndDate;
      })
    : data.tournaments;
  const tournamentsHashSet = tournaments !== undefined ? new Set(tournaments.map(x => x.tournamentID)) : undefined;

  const registrationListsLoading = tournaments === undefined;
  const registrationLists = isLoading || tournamentsHashSet === undefined ? [] : data.registrationLists.filter((list) => {
    return tournamentsHashSet.has(list.tournamentID)
  })

  const featuredTournaments = featuredTourneyDataIsLoading ? [] : featuredTourneyData.tournaments;
  const featuredTournamentsRegistrations = featuredTourneyDataIsLoading ? [] : featuredTourneyData.registrationLists;

  return (
    <div className="container-fluid">
      <br className="mobile-no-br" />
      <br className="mobile-no-br" />
      <br className="mobile-no-br" />
      <br className="mobile-no-br" />
      <div className="d-flex justify-content-center">
        {isLoading || featuredTourneyDataIsLoading || registrationListsLoading ? (
          <Loader />
        ) : (
          <>
            <div
              className={`d-flex ${
                tournaments.length === 0 ? "flex-column" : "flex-column-reverse"
              } align-items-center w-100`}
            >
              {/* Featured Tournaments */}
              {featuredTournaments.length > 0 && searchType === "General" && (
                <div className="search-results-container">
                  <h1 className="section-header">Featured Tournaments</h1>
                  <div className="tourn-container">
                    {featuredTournaments.map((tournament: any, index: number) => (
                      <div key={tournament.tournamentID}>
                        <Card
                          setBigSearchOn={setBigSearchOn}
                          registrations={featuredTournamentsRegistrations[index].registrations} // Ensure this data is relevant to featured tournaments
                          user={user}
                          tournament={tournament}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Name of the search results */}
              <div className="search-results-container">
                <h1 className="section-header">
                  {searchType === "General" && "Search Results"}
                  {searchType === "Registration" && "Registrations"}
                  {searchType === "Admin" && "Tournaments You Manage"}
                </h1>

                {tournaments.length > 0 ? (
                  <div className="tourn-container">
                    {tournaments.map((tournament: any, index: number) => (
                      <div key={tournament.tournamentID}>
                        <Card
                          setBigSearchOn={setBigSearchOn}
                          registrations={registrationLists[index].registrations}
                          user={user}
                          tournament={tournament}
                        />
                      </div>
                    ))}
                  </div>
                ) : lat === 0 && lng === 0 ? (
                  <div className="w-100 d-flex flex-column justify-content-center align-items-center no-content">
                    <h3>Search For Tournaments Near You</h3>
                    <div className="text-center">
                      Please enable location permissions and reload your page or search for an address to find
                      tournaments in your area.
                    </div>
                  </div>
                ) : (
                  <div className="w-100 d-flex flex-column justify-content-center align-items-center no-content">
                    <h3>No Tournaments found!</h3>
                    <div className="text-center">
                      Sorry, no tournaments matched your search. Broaden your search criteria or{" "}
                      <a className="fake-link" onClick={() => navigate("/createtournament")}>
                        create a tournament
                      </a>{" "}
                      in your area to start playing.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
