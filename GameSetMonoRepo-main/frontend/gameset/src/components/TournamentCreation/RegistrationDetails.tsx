import { FormEvent, useEffect, useState } from "react";
import { useListDivisionsQuery } from "../../store/apis/tournamentApi";
import { DateInput, DollarInput, FormGroup, FormRow, SelectorInput, TimeInput } from "../Forms/index";

type RegistrationData = {
  registrationStartDate: string;
  registrationEndDate: string;
  registrationFee?: number;
  divisionID: number;
};

type RegistrationDetailsProps = RegistrationData & {
  updateFields: (fields: Partial<RegistrationData>) => void;
};

export default function RegistrationDetails({
  registrationStartDate,
  registrationEndDate,
  registrationFee,
  divisionID,
  updateFields,
}: RegistrationDetailsProps) {
  const [regStartTime, setRegStartTime] = useState(registrationStartDate.split("T")[1] || "");
  const [regEndTime, setRegEndTime] = useState(registrationEndDate.split("T")[1] || "");
  const [splitRegStartDate, setSplitRegStartDate] = useState(
    registrationStartDate.split("T")[0].replace("T", "") || ""
  );
  const [splitRegEndDate, setSplitRegEndDate] = useState(registrationEndDate.split("T")[0].replace("T", "") || "");
  const [combinedStartDate, setCombinedStartDate] = useState(registrationStartDate || "");
  const [combinedEndDate, setCombinedEndDate] = useState(registrationEndDate || "");
  const currentDate = new Date();
  const minDate = currentDate.toISOString().split("T")[0];

  const handleStartDateChange = (e: FormEvent<HTMLInputElement>) => {
    const date = e.currentTarget.value;
    setSplitRegStartDate(date);
  };

  const handleStartTimeChange = (e: FormEvent<HTMLInputElement>) => {
    const time = e.currentTarget.value;
    setRegStartTime(time);
  };

  const handleEndDateChange = (e: FormEvent<HTMLInputElement>) => {
    const date = e.currentTarget.value;
    setSplitRegEndDate(date);
  };

  const handleEndTimeChange = (e: FormEvent<HTMLInputElement>) => {
    const time = e.currentTarget.value;
    setRegEndTime(time);
  };

  useEffect(() => {
    setCombinedStartDate(splitRegStartDate + "T" + regStartTime);
  }, [splitRegStartDate, regStartTime]);

  useEffect(() => {
    setCombinedEndDate(splitRegEndDate + "T" + regEndTime);
  }, [splitRegEndDate, regEndTime]);

  useEffect(() => {
    updateFields({ registrationStartDate: combinedStartDate });
  }, [combinedStartDate]);

  useEffect(() => {
    updateFields({ registrationEndDate: combinedEndDate });
  }, [combinedEndDate]);

  const { data: divisions, isLoading } = useListDivisionsQuery({});

  let items = isLoading
    ? []
    : [
        ...divisions!.map((division: Division) => ({
          id: division.divisionID.toString(),
          name: division.divisionName,
        })),
      ];

  console.log(items);

  return (
    <FormGroup title="Registration Details">
      <FormRow>
        <div className="date-time-container">
          <DateInput
            label="Registration Begins"
            required={true}
            value={splitRegStartDate}
            onChange={handleStartDateChange}
          />
          <TimeInput label="Start Time" required={true} value={regStartTime} onChange={handleStartTimeChange} />
        </div>
        <div className="date-time-container">
          <DateInput label="Registration Ends" required={true} value={splitRegEndDate} onChange={handleEndDateChange} />
          <TimeInput label="End Time" required={true} value={regEndTime} onChange={handleEndTimeChange} />
        </div>
      </FormRow>
      <FormRow>
        <DollarInput
          label="Registration Fee"
          required={false}
          value={registrationFee.toString() ? registrationFee.toString() : ""}
          onChange={(e) =>
            updateFields({
              registrationFee: parseInt(e.target.value),
            })
          }
        />
        {!isLoading && (
          <SelectorInput
            label="Divisions"
            value={divisionID !== null && divisionID !== undefined ? divisionID.toString() : ""}
            options={items}
            required={true}
            onChange={(e) => updateFields({ divisionID: parseInt(e.target.value) })}
          />
        )}
      </FormRow>
    </FormGroup>
  );
}
