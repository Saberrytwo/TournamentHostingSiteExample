import { SearchType } from "../../types/params/enums";
import { SearchValues, SmallScreenProps } from "../../types/params/params";
import { SearchInput, SelectorInput, TextInput } from "../Forms";
import { SmallSearch } from "./smallSearch";

export const SmallSearchSheet: React.FC<SmallScreenProps> = ({
  smallSheetOn,
  setSmallSheetOn,
  user,
  searchType,
  setSearchType,
  setSearchValues,
  searchValues,
  onSearchChange,
}) => {
  const searchOptions = () => {
    let tempOptions = [{ id: SearchType.General, name: "Tournaments" }];
    if (user) {
      tempOptions.push({ id: SearchType.Registration, name: "Registrations" });
      tempOptions.push({ id: SearchType.Admin, name: "My Tournaments" });
    }
    return tempOptions;
  };
  const handleLocationSelection = (lat: number, lng: number, city: string) => {
    setSearchValues((prevValues) => ({
      ...prevValues,
      lat: lat,
      lng: lng,
      city: city,
    }));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof SearchValues) => {
    setSearchValues((prevValues) => ({
      ...prevValues,
      [fieldName]: e.target.value,
    }));
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    setSmallSheetOn(false);
    e.preventDefault();

    onSearchChange(searchValues.lat, searchValues.lng, searchValues.distance, searchType);
  };
  return (
    <form
      className={`mobile-sheet ${smallSheetOn ? "sheet-display" : ""}`}
      onSubmit={handleSearchSubmit}
      id="bigSearch"
    >
      <div className="d-flex m-3 align-items-center justify-content-between">
        <button onClick={() => setSmallSheetOn(false)} className="btn btn-sm x-btn btn-reverse-primary rounded-circle">
          <b className="tabbing-font">{" X "}</b>
        </button>
        <h2 className="mb-0">{!user ? "Search Tournaments" : "Search"}</h2>
        <button className="px-2 btn btn-sm rounded-circle opacity-0">{" X "}</button>
      </div>
      <div className="d-flex flex-column align-items-center">
        <div className="w-75">
          {user && (
            <SelectorInput
              label="Search Type"
              options={searchOptions()}
              value={searchType}
              setValue={setSearchType}
              defaultValue={false}
            />
          )}
        </div>
        <div className="w-75 bg-white border rounded p-3 mt-3 mx-3">
          <h3>Location</h3>
          <SmallSearch handleSelection={handleLocationSelection} defaultCity={searchValues.city} />
        </div>
        <div className="w-75 bg-white border rounded p-3 mt-3 mx-3">
          <h3>Distance</h3>
          <TextInput
            label="Distance"
            value={searchValues.distance.toString()}
            onChange={(e) => handleInputChange(e, "distance")}
          />
        </div>
        <div className="w-75 bg-white border rounded p-3 mt-3 mx-3">
          <h3>Sport</h3>
          <SelectorInput value={"Any"} options={[{ id: "Any", name: "Any" }]} defaultValue={false} />
        </div>
        <button className="btn btn-primary-blue mt-3" type="submit">
          <img src="/icons/search.svg" width="25"></img> Search
        </button>
      </div>
    </form>
  );
};
