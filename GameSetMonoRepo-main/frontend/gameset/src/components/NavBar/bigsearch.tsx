import React, { useEffect, useState } from "react";
import { SearchType } from "../../types/params/enums";
import { BigSearchProps, SearchValues } from "../../types/params/params";
import { PlacesAutocomplete } from "./customAuto";

export const BigSearch: React.FC<BigSearchProps> = ({
  hideBigSearch,
  onSearchChange,
  searchType,
  bigSearchOn,
  searchValues,
  setSearchValues,
}) => {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSearchChange(searchValues.lat, searchValues.lng, searchValues.distance, searchType);
  };

  useEffect(() => {
    onSearchChange(searchValues.lat, searchValues.lng, searchValues.distance, searchType);
  }, [searchType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof SearchValues) => {
    setSearchValues((prevValues) => ({
      ...prevValues,
      [fieldName]: e.target.value,
    }));
  };

  const handleLocationSelection = (lat: number, lng: number, city: string) => {
    setSearchValues((prevValues) => ({
      ...prevValues,
      lat: lat,
      lng: lng,
      city: city,
    }));
  };

  return (
    <div className={`justify-content-center d-flex small-screen ${bigSearchOn ? "" : "d-none"}`}>
      <form
        onSubmit={handleSearchSubmit}
        className="rounded-border pe-2 py-2 ps-3 align-items-center mb-2 w-100 mw-900 d-flex"
        id="bigSearch"
      >
        <div className="d-flex flex-column me-2 ms-3 w-125">
          <b className="text-start small-search-text small-margin">Location</b>

          <PlacesAutocomplete handleSelection={handleLocationSelection} defaultCity={searchValues.city} />
        </div>

        <div className="vertical-line"></div>
        <div className="d-flex flex-column w-75 me-2 ms-3">
          <b className="text-start small-search-text small-margin">Distance</b>
          <input
            type="text"
            className="border-0"
            placeholder="25 miles"
            id="distance"
            value={searchValues.distance}
            onChange={(e) => handleInputChange(e, "distance")}
          />
        </div>
        <div className="vertical-line"></div>
        <div className="d-flex flex-column w-100 me-2 ms-3">
          <b className="text-start small-search-text small-margin">Sport</b>
          <span className="border-0 w-75">Any </span>
        </div>
        <button className="border-0 d-flex align-items-center rounded-background p-2 bg-primary-blue" type="submit">
          <img src="/icons/search.svg" alt="Search Icon" width="25" />
          <h4 className="text-white mb-0 pb-0 mt-1 mx-2">Search</h4>
        </button>
      </form>
    </div>
  );
};
