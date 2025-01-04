import useOnclickOutside from "react-cool-onclickoutside";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import "./index.css";

interface address_components {
  long_name: string;
  short_name: string;
  types: string[];
}

export const SmallSearch = ({
  handleSelection,
  defaultCity,
}: {
  handleSelection: (lat: number, lng: number, city: string) => void;
  defaultCity?: string;
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "YOUR_CALLBACK_NAME",
    requestOptions: {
      types: ["geocode"],
    },
    debounce: 300,
    defaultValue: defaultCity ?? "Current Location",
  });
  const ref = useOnclickOutside(() => {
    // When the user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e: any) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect = (description: any) => async () => {
    setValue(description.description, false);
    clearSuggestions();

    const parameter = {
      address: description.description,
    };

    const geocodeResults = await getGeocode(parameter);
    const { lat, lng } = await getLatLng(geocodeResults[0]);

    handleSelection(lat, lng, description.description);
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          className="p-2 suggestion-item cursor-pointer overflow-hidden"
          key={place_id}
          onClick={handleSelect(suggestion)}
        >
          <strong>{main_text}</strong>
          <small> {secondary_text}</small>
        </li>
      );
    });

  return (
    <div ref={ref}>
      <input
        value={value}
        onChange={handleInput}
        // disabled={!ready}
        placeholder="Current Location"
        className="form-control"
        style={{ width: "100%" }}
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && (
        <ul className="list-unstyled p-0 m-0 shadow-sm small-suggestion-list">{renderSuggestions()}</ul>
      )}
    </div>
  );
};
