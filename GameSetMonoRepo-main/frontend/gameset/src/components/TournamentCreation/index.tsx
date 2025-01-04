import { Loader } from "@aws-amplify/ui-react";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/hooks";
import { useGooglePlaces } from "../../hooks/useGooglePlaces";
import { useMultiStepForm } from "../../hooks/useMultiStepForm";
import { getS3PresignedUrl, sendImageToS3 } from "../../store/apis/awsApi";
import {
  useCreateTournamentMutation,
  useGetTournamentDetailsQuery,
  useUpdateTournamentAndTournamentDivisionsMutation,
} from "../../store/apis/tournamentApi";
import { Form } from "../Forms/index";
import DetailsForm from "./DetailsForm";
import LocationForm from "./LocationForm";
import RegistrationDetails from "./RegistrationDetails";
import "./index.css";

const currentDate = new Date().toISOString().slice(0, 10);
const currentTime = new Date().toLocaleTimeString("en-US", {
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
});

type incomingData = {
  item1: {
    tournamentTitle: string;
    description: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipcode: string;
    latitude: number;
    longitude: number;
    imageUrl: string;
    startDate: string;
    endDate: string;
    tournamentStatusId: number;
    registrationStartDate: string;
    registrationEndDate: string;
    registrationFee: number;
  };
  item4: { divisionID: number }[];
};

type FormData = {
  title: string;
  description: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  latitude?: number;
  longitude?: number;
  imageURL?: string;
  tournamentImage?: File;
  startDate: string;
  endDate: string;
  tournamentStatusId: number;
  registrationStartDate: string;
  registrationEndDate: string;
  registrationFee?: number;
  divisionID: number;
  userID: string;
};

const INITIAL_DATA: FormData = {
  title: "",
  description: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  startDate: currentDate + "T" + currentTime,
  endDate: currentDate + "T" + currentTime,
  tournamentStatusId: 10,
  registrationStartDate: currentDate + "T" + currentTime,
  registrationEndDate: currentDate + "T" + currentTime,
  registrationFee: 0,
  divisionID: null,
  userID: "",
};

export const CreateTournament = () => {
  const locationFormIndex = 1;
  const detailsFormIndex = 0;
  const navigate = useNavigate();
  const { tournamentID } = useParams();
  const [isValidLocation, setLocationValid] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [tournamentData, setTournamentData] = useState(undefined as FormData | undefined);
  const [imageURLToPass, setImageURL] = useState(undefined as string | undefined);
  const {
    data,
    isLoading: tournamentLoading,
    isLoading: getDetailsLoading,
  } = tournamentID
    ? useGetTournamentDetailsQuery({
        TournamentID: parseInt(tournamentID!),
      })
    : { data: undefined, isLoading: false };

  const user = useAppSelector((state) => state.auth.user);
  const { fetchLatLng, loading, error } = useGooglePlaces();

  const notifyAddressError = () =>
    toast.error("This address is invalid. Please check your inputs!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const [createTournament, { isLoading, isError }] = useCreateTournamentMutation();
  const [updateTournament, { isLoading: isUpdateLoading, isError: isUpdateError }] =
    useUpdateTournamentAndTournamentDivisionsMutation();

  const clearImage = () => {
    setTournamentData((prevData) => ({
      ...prevData,
      imageURL: undefined,
      tournamentImage: undefined,
    }));
    setImageURL("");
  };

  const handleFetchLatLng = async () => {
    const fullAddress = `${tournamentData.address1}%20${tournamentData.address2 || ""}%20${tournamentData.city}%20${
      tournamentData.state
    }%20${tournamentData.zip}`;
    try {
      const { lat, lng } = await fetchLatLng(fullAddress);
      updateFields({ latitude: lat, longitude: lng });
      return true;
    } catch (error) {
      setLocationValid(false);
      return false;
    }
  };

  const saveTournamentImage = async () => {
    try {
      const UUID = window.crypto.randomUUID();
      const fileName = `tournament/${UUID}-${new Date().getTime()}`;
      let newTournamentImageURL = imageURLToPass;

      if (tournamentData.imageURL !== imageURLToPass) {
        let s3PresignedUrl: string = await getS3PresignedUrl(fileName);

        if (s3PresignedUrl !== "" && tournamentData.tournamentImage !== null) {
          const imageResult = await sendImageToS3(s3PresignedUrl, tournamentData.tournamentImage);
          newTournamentImageURL =
            imageResult.status === 200 ? `https://cloudfront.gameset.link/${fileName}` : newTournamentImageURL;

          updateFields({ imageURL: newTournamentImageURL });
        }
      }
    } catch (error) {
      toast.error("An error occurred during image upload", {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const updateFields = (fields: Partial<FormData>) => {
    setTournamentData((prev) => {
      const updatedFields: Partial<FormData> = { ...prev, ...fields };

      return updatedFields as FormData;
    });
  };

  useEffect(() => {
    setImageURL(tournamentData?.imageURL);
  }, [tournamentData?.imageURL]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (data) {
      const initialData: incomingData = {
        item1: data.item1,
        item4: data.item4 || [],
      };
      setTournamentData(
        (prev) =>
          ({
            ...prev,
            tournamentID: tournamentID,
            title: initialData.item1.tournamentTitle,
            description: initialData.item1.description,
            address1: initialData.item1.address1,
            address2: initialData.item1.address2,
            city: initialData.item1.city,
            state: initialData.item1.state,
            zip: initialData.item1.zipcode,
            startDate: initialData.item1.startDate,
            endDate: initialData.item1.endDate,
            latitude: initialData.item1.latitude,
            longitude: initialData.item1.longitude,
            imageURL: initialData.item1.imageUrl,
            tournamentStatusId: initialData.item1.tournamentStatusId,
            registrationStartDate: initialData.item1.registrationStartDate,
            registrationEndDate: initialData.item1.registrationEndDate,
            registrationFee: initialData.item1.registrationFee ? initialData.item1.registrationFee : 0,
            divisionID: initialData.item4.length > 0 ? initialData.item4[0].divisionID : null,
          } as FormData)
      );
      setLoadingData(false);
    } else {
      setTournamentData(INITIAL_DATA);
      setLoadingData(false);
    }
    if (error) {
      setLoadingData(false);
    } else {
      setLoadingData(false);
    }
  }, [data]);

  useEffect(() => {
    setTournamentData((prev) => {
      return { ...prev, userID: user.userID };
    });
  }, [user]);

  const { currentStepIndex, nextStep, previousStep, step, isFirstStep, isLastStep } = useMultiStepForm([
    <DetailsForm
      {...tournamentData}
      updateFields={updateFields}
      setImageURL={setImageURL}
      imageURLToPass={imageURLToPass}
      clearImage={clearImage}
    />,
    <LocationForm {...tournamentData} updateFields={updateFields} setLocationValid={setLocationValid} />,
    <RegistrationDetails {...tournamentData} updateFields={updateFields} />,
  ]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (currentStepIndex === detailsFormIndex) {
      saveTournamentImage();
    }
    if (currentStepIndex === locationFormIndex) {
      try {
        const isValidLocation = await handleFetchLatLng();
        if (!isValidLocation) {
          notifyAddressError();
          return;
        }
      } catch (error) {
        toast.error("An error occurred while validating the address", {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
    }
    if (!isLastStep) {
      return nextStep();
    }

    if (tournamentID) {
      let tournament: Tournament = {
        tournamentID: parseInt(tournamentID),
        tournamentTitle: tournamentData.title,
        registrationStartDate: tournamentData.registrationStartDate,
        registrationEndDate: tournamentData.registrationEndDate,
        address1: tournamentData.address1,
        address2: tournamentData.address2,
        city: tournamentData.city,
        state: tournamentData.state,
        zipcode: tournamentData.zip,
        latitude: tournamentData.latitude,
        longitude: tournamentData.longitude,
        imageURL: tournamentData.imageURL,
        tournamentStatusID: tournamentData.tournamentStatusId,
        startDate: tournamentData.startDate,
        endDate: tournamentData.endDate,
        description: tournamentData.description,
        registrationFee: tournamentData.registrationFee,
      };
      let divisionIDList = tournamentData.divisionID;
      let userID = tournamentData.userID;

      const tournamentBody: TournamentBody = {
        Tournament: tournament,
        DivisionIdList: [divisionIDList],
        UserId: userID,
      };
      updateTournament(tournamentBody)
        .then((res) => {
          navigate(`/tournament/${tournamentID}`);
        })
        .catch((error) => {
          toast.error("An error occurred while updating the tournament", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        });
    } else {
      let tournament: Tournament = {
        tournamentTitle: tournamentData.title,
        registrationStartDate: tournamentData.registrationStartDate,
        registrationEndDate: tournamentData.registrationEndDate,
        address1: tournamentData.address1,
        address2: tournamentData.address2,
        city: tournamentData.city,
        state: tournamentData.state,
        zipcode: tournamentData.zip,
        latitude: tournamentData.latitude,
        longitude: tournamentData.longitude,
        imageURL: tournamentData.imageURL,
        tournamentStatusID: tournamentData.tournamentStatusId,
        startDate: tournamentData.startDate,
        endDate: tournamentData.endDate,
        description: tournamentData.description,
        registrationFee: tournamentData.registrationFee,
      };
      let divisionIDList = tournamentData.divisionID;
      let userID = tournamentData.userID;

      const tournamentBody: TournamentBody = {
        Tournament: tournament,
        DivisionIdList: [divisionIDList],
        UserId: userID,
      };

      createTournament(tournamentBody)
        .unwrap()
        .then((res) => {
          navigate(`/tournament/${res.tournamentID}`);
        })
        .catch((error) => {
          toast.error("An error occurred while creating the tournament", {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        });
    }
  }

  if (getDetailsLoading || loadingData || !tournamentData) {
    return <Loader />;
  }

  return (
    <div className="d-flex justify-content-center mt-3 overflow-auto" style={{ maxHeight: "75vh" }}>
      <div className="creation-container">
        {tournamentLoading || isLoading || tournamentData.description === undefined ? (
          <Loader />
        ) : (
          <>
            <Form onSubmit={onSubmit}>
              {step}
              <div className="d-flex justify-content-between mt-4 px-3">
                {!isFirstStep && (
                  <button type="button" className="btn btn-primary-blue" disabled={isLoading} onClick={previousStep}>
                    Previous
                  </button>
                )}
                {isFirstStep && <div></div>}
                <button type="submit" className="btn btn-primary-blue" disabled={isLoading}>
                  {isLastStep ? "Finish Tournament" : "Next"}
                </button>
              </div>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};
