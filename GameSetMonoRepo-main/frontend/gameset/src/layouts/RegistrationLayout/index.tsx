import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavBar } from "../../components/NavBar";
import RegSideBar from "../../components/RegSideBar";
import { SearchType } from "../../types/params/enums";
import { SearchValues } from "../../types/params/params";
import "./index.css";

export const RegistrationLayout = () => {
  const location = useLocation(); // Get the current location
  const [bigSearchOn, setBigSearchOn] = useState(location.pathname === "/" || location.pathname.startsWith("/login")); // Initialize bigSearchOn state

  // Update bigSearchOn state when location changes
  useEffect(() => {
    const isRootPath = location.pathname === "/" || location.pathname.startsWith("/login");
    setBigSearchOn(isRootPath);
  }, [location]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [searchData, setSearchData] = useState<SearchValues>({
    lat: 40.258,
    lng: -111.6679,
    distance: 25,
    searchType: SearchType.General,
  });

  const handleSearchChange = (lat: number, lng: number, distance: number, searchType: SearchType) => {
    setSearchData({ lat, lng, distance, searchType });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div>
      <NavBar onSearchChange={handleSearchChange} bigSearchOn={bigSearchOn} setBigSearchOn={setBigSearchOn} />
      <div className="app">
        <RegSideBar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div
          className="content mobile-no-ml"
          style={{
            marginLeft: isSidebarOpen ? "250px" : "70px",
          }}
        >
          <Outlet context={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
};
