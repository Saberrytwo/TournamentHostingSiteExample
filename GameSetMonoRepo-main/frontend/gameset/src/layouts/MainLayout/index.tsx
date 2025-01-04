import { Outlet } from "react-router-dom";
import { NavBar } from "../../components/NavBar";
import { useState, useEffect } from "react";
import { SearchType } from "../../types/params/enums";
import { SearchValues } from "../../types/params/params";
import { useLocation } from "react-router-dom";

export const MainLayout = () => {
  const location = useLocation(); // Get the current location
  const [bigSearchOn, setBigSearchOn] = useState(location.pathname === "/" || location.pathname.startsWith("/login")); // Initialize bigSearchOn state

  // Update bigSearchOn state when location changes
  useEffect(() => {
    const isRootPath = location.pathname === "/" || location.pathname.startsWith("/login");
    setBigSearchOn(isRootPath);
  }, [location]);

  const [searchData, setSearchData] = useState<SearchValues>({
    lat: 0,
    lng: 0,
    distance: 25,
    searchType: SearchType.General,
  });

  const handleSearchChange = (lat: number, lng: number, distance: number, searchType: SearchType) => {
    setSearchData({ lat, lng, distance, searchType });
  };

  return (
    <div>
      <NavBar onSearchChange={handleSearchChange} bigSearchOn={bigSearchOn} setBigSearchOn={setBigSearchOn} />
      <Outlet context={[searchData]} />
    </div>
  );
};
