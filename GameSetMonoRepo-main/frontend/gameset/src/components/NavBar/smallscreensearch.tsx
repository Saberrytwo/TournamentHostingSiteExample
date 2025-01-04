import { useNavigate } from "react-router-dom";
import { SmallScreenProps } from "../../types/params/params";
import { SearchType } from "../../types/params/enums";

export const SmallScreenSearch: React.FC<SmallScreenProps> = ({
  bigSearchOn,
  setBigSearchOn,
  smallSheetOn,
  setSmallSheetOn,
  searchValues,
  setSearchValues,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`rounded-border pe-1 py-1 ps-2 align-items-center d-flex mobile-search not-main-search mx-3 ms-4 ${
        bigSearchOn ? "d-none" : ""
      }`}
    >
      <button
        className="border-0 rounded-circle bg-primary-blue small-s-icon"
        type="button"
        onClick={
          bigSearchOn
            ? () => setSmallSheetOn(true)
            : () => {
                navigate("/");
                setBigSearchOn(true);
                setSearchValues({
                  lat: 0,
                  lng: 0,
                  distance: 25,
                  searchType: SearchType.General,
                  city: "Current Location",
                });
              }
        }
      >
        <img src="/icons/search.svg" width="22" className="padding-b-2" />
      </button>
      <button
        className="bg-white border-0 small-search-text w-100 city-overflow text-start mx-2"
        type="button"
        onClick={
          bigSearchOn
            ? () => setSmallSheetOn(true)
            : () => {
                navigate("/");
                setBigSearchOn(true);
                setSearchValues({
                  lat: 0,
                  lng: 0,
                  distance: 25,
                  searchType: SearchType.General,
                  city: "Current Location",
                });
              }
        }
      >
        {searchValues.city}
        <div className="text-secondary">{searchValues.distance} mi • Any</div>
      </button>
    </div>
  );
};
