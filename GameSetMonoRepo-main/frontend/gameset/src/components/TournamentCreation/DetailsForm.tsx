import { FormEvent, MouseEventHandler, useEffect, useState } from "react";
import { DateInput, FormGroup, FormRow, NewImageInput, TextInput, TimeInput } from "../Forms/index";
import TipTap from "../TipTap/TipTap.tsx";

type DetailsData = {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  imageURL?: string;
  tournamentImage?: File;
};

type DetailsFormProps = DetailsData & {
  updateFields: (fields: Partial<DetailsData>) => void;
  setImageURL: (url: string) => void;
  imageURLToPass: string;
  clearImage: MouseEventHandler<HTMLButtonElement>;
};

export default function DetailsForm({
  title,
  description,
  startDate,
  endDate,
  imageURL,
  tournamentImage,
  updateFields,
  setImageURL,
  clearImage,
  imageURLToPass,
}: DetailsFormProps) {
  const [startTime, setStartTime] = useState(startDate && startDate.includes("T") ? startDate.split("T")[1] : "");
  const [endTime, setEndTime] = useState(endDate && endDate.includes("T") ? endDate.split("T")[1] : "");
  const [splitStartDate, setStartDate] = useState(startDate && startDate.includes("T") ? startDate.split("T")[0] : "");
  const [splitEndDate, setEndDate] = useState(endDate && endDate.includes("T") ? endDate.split("T")[0] : "");
  const [stateDescription, setDescription] = useState(description);
  const currentDate = new Date();

  const handleStartDateChange = (e: FormEvent<HTMLInputElement>) => {
    const date = e.currentTarget.value;
    setStartDate(date);
    updateFields({ startDate: `${date}T${startTime}` });
  };

  const handleStartTimeChange = (e: FormEvent<HTMLInputElement>) => {
    const time = e.currentTarget.value;
    setStartTime(time);
    updateFields({ startDate: `${splitStartDate}T${time}` });
  };

  const handleEndDateChange = (e: FormEvent<HTMLInputElement>) => {
    const date = e.currentTarget.value;
    setEndDate(date);
    updateFields({ endDate: `${date}T${endTime}` });
  };

  const handleEndTimeChange = (e: FormEvent<HTMLInputElement>) => {
    const time = e.currentTarget.value;
    setEndTime(time);
    updateFields({ endDate: `${splitEndDate}T${time}` });
  };

  useEffect(() => {
    setStartDate(startDate.split("T")[0] || "");
    setStartTime(startDate.split("T")[1] || "");
  }, [startDate]);

  useEffect(() => {
    setEndDate(endDate.split("T")[0] || "");
    setEndTime(endDate.split("T")[1] || "");
  }, [endDate]);

  useEffect(() => {
    setDescription(description);
  }, [description]);

  return (
    <FormGroup title="Tournament Details">
      <FormRow>
        <div className="d-flex special-image-container">
          {imageURLToPass && (
            <div className="d-flex flex-column align-items-start">
              <div className="image-container">
                <img
                  src={imageURLToPass !== "" ? imageURLToPass : "/icons/tournament.svg"}
                  height="170"
                  className="mb-3 me-3"
                  onError={() => setImageURL(undefined)}
                />
                <button onClick={clearImage} className="bottom-right-button">
                  Clear Image
                </button>
              </div>
            </div>
          )}

          <div className={`d-flex flex-column col ${imageURLToPass ? "gap-4" : "gap-4"}`}>
            <NewImageInput
              setURLValue={setImageURL}
              label="Choose tournament image..."
              onChange={(e) => updateFields({ tournamentImage: e.target.files[0] })}
            />
            <TextInput
              label="Tournament Title"
              required={true}
              value={title}
              onChange={(e) => updateFields({ title: e.target.value })}
            />
          </div>
        </div>
      </FormRow>
      <FormRow className="special-date-timerow">
        <div className="date-time-container">
          <DateInput label="Start Date" required={true} value={splitStartDate} onChange={handleStartDateChange} />
          <TimeInput label="Start Time" required={true} value={startTime} onChange={handleStartTimeChange} />
        </div>
        <div className="date-time-container">
          <DateInput label="End Date" required={true} value={splitEndDate} onChange={handleEndDateChange} />
          <TimeInput label="End Time" required={true} value={endTime} onChange={handleEndTimeChange} />
        </div>
      </FormRow>
      <FormRow>
        <TipTap
          description={stateDescription}
          required={true}
          label="Tournament Description"
          onChange={(e) =>
            updateFields({
              description: e,
            })
          }
        />
      </FormRow>
    </FormGroup>
  );
}
