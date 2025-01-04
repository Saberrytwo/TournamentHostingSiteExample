import {
  FormGroup,
  FormRow,
  StateSelectorInput,
  TestInput2,
} from "../Forms/index";
// import { useGooglePlaces } from "../../hooks/useGooglePlaces";

type AddressData = {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  latitude?: number;
  longitude?: number;
};

type AddressFormProps = AddressData & {
  updateFields: (fields: Partial<AddressData>) => void;
  setLocationValid: (valid: boolean) => void;
};

export default function LocationForm({
  address1,
  address2,
  city,
  state,
  zip,
  updateFields,
  setLocationValid,
}: AddressFormProps) {
  setLocationValid(false);
  return (
    <FormGroup title="Location Details">
      <FormRow>
        <TestInput2
          label="Address 1"
          required={true}
          value={address1}
          onChange={(e) => updateFields({ address1: e.target.value })}
        />
        <TestInput2
          label="Address 2"
          required={false}
          value={address2}
          onChange={(e) => updateFields({ address2: e.target.value })}
        />
      </FormRow>
      <FormRow>
        <TestInput2
          label="City"
          required={true}
          value={city}
          onChange={(e) => updateFields({ city: e.target.value })}
        />
        <StateSelectorInput
          label="State"
          required={true}
          value={state}
          onChange={(e) => updateFields({ state: e.target.value })}
        />
        <TestInput2
          label="Zip"
          required={true}
          value={zip}
          onChange={(e) => updateFields({ zip: e.target.value })}
        />
      </FormRow>
    </FormGroup>
  );
}
