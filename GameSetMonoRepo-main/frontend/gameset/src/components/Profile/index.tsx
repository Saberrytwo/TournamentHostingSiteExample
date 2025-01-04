import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/hooks";
import { getS3PresignedUrl, sendImageToS3 } from "../../store/apis/awsApi";
import { useUpdateUserMutation } from "../../store/apis/userApi";
import { User } from "../../types/user";
import {
  DateInput,
  EmailInput,
  Form,
  FormGroup,
  FormRow,
  ImageInput,
  PhoneInput,
  SelectorInput,
  TextInput,
} from "../Forms";
import { Loader } from "../Loader";
import "./index.css";

async function currentSession() {
  try {
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
    return idToken;
  } catch (err) {
    toast.error("Something went wrong with your session", {
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
}

export const Profile = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isUserLoaded = useAppSelector((state) => state.auth.loaded);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [imgLoading, setImgLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const currentDate = new Date(Date.now());
  const currentDateISOString = currentDate.toISOString();
  const formattedDate = currentDateISOString.slice(0, 10);
  const [bday, setBDay] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState("");

  const genderOptions = [
    { name: "Female", id: "F" },
    { name: "Male", id: "M" },
    { name: "Non-Binary", id: "NB" },
    { name: "Other", id: "O" },
  ];

  useEffect(() => {
    if (user) {
      setUsername(user.userName);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phoneNumber);
      setGender(user.gender);
      setBDay(user.birthdate?.slice(0, 10));
      setZipcode(user.zipcode);
      setImageURL(user.imageURL);
    }
    fetchGoogleUserInfo();
  }, [user]);

  const fetchGoogleUserInfo = async () => {
    try {
      const idToken = await currentSession();
      const email = String(idToken.payload.email);
      setEmail(email);
    } catch (error) {
      toast.error("An error occurred while fetching Google user information.", {
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

  const saveProfile = async () => {
    try {
      const fileName = `${user?.userID}${new Date().getTime()}`;
      let newUserURL = user.imageURL;

      if (imageURL !== newUserURL) {
        let s3PresignedUrl: string = await getS3PresignedUrl(fileName);

        if (s3PresignedUrl != "" && image != null) {
          const imageResult = await sendImageToS3(s3PresignedUrl, image);
          newUserURL = imageResult.status == 200 ? `https://cloudfront.gameset.link/${fileName}` : newUserURL;
        }
      }

      const newUser: User = new User({
        userID: user.userID,
        userName: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phone,
        zipcode: zipcode,
        birthdate: validISOString(bday),
        imageURL: newUserURL,
        gender: gender,
      });

      const formData = { User: newUser };
      updateUser(formData)
        .unwrap()
        .then(() => {
          notifyProfileUpdateSuccess();
        })
        // .then(() => {
        //   // we have to reload to make the image update everywhere
        //   window.location.reload();
        // })
        .catch(() => {
          notifyProfileUpdateError();
        });
    } catch (error) {
      toast.error("An error occurred while updating the user", {
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

  const notifyProfileUpdateSuccess = () =>
    toast.success("Profile successfully updated", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notifyProfileUpdateError = () =>
    toast.error("An error occurred while updating profile", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  function validISOString(dateString: string) {
    if (!dateString) return "";
    if (dateString === "") return "";
    else if (dateString.length > 10) return dateString.slice(0, 10);
    else if (dateString.length < 10) return "";
    else {
      const date = new Date(dateString);
      return date.toISOString();
    }
  }

  return (
    <>
      {isLoading ? (
        <Loader styles={{ zIndex: 10000000 }} />
      ) : (
        <main>
          <div className="d-flex justify-content-center mt-3">
            <h1>Edit Profile</h1>
          </div>
          <div className="d-flex justify-content-center">
            <div className="profile-width mt-3">
              <div className="d-flex flex-column align-items-center justify-content-center">
                {imgLoading && isUserLoaded === false ? (
                  <>
                    <Loader styles={{ width: "170px", height: "170px" }} className="mb-3 rounded-circle" />
                    <img
                      src={imageURL}
                      width="170"
                      height="170"
                      className="mb-3 rounded-circle"
                      style={{ display: imgLoading ? "none" : "block" }}
                      onLoad={() => {
                        setImgLoading(false);
                      }}
                      hidden={true}
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={!(imageURL === "" || imageURL === null) ? imageURL : "/icons/user.svg"}
                      width="170"
                      height="170"
                      className="mb-3 rounded-circle"
                      style={{ display: imgLoading ? "none" : "block" }}
                      onLoad={() => {
                        setImgLoading(false);
                      }}
                    />
                  </>
                )}
                <div className="w-75 d-flex flex-column justify-content-center">
                  <ImageInput setValue={setImage} setURLValue={setImageURL} />
                  <div className="text-center small-text">**Please upload a square image for best results.**</div>
                </div>
              </div>
              <Form>
                <FormGroup title="">
                  <FormRow>
                    <TextInput label="Username" disabled={true} value={username} />
                  </FormRow>
                  <FormRow>
                    <TextInput label="First Name" value={firstName} setValue={setFirstName} />
                    <TextInput label="Last Name" value={lastName} setValue={setLastName} />
                  </FormRow>
                  <FormRow>
                    <EmailInput value={email} setValue={setEmail} />
                  </FormRow>
                  <FormRow>
                    <PhoneInput value={phone} setValue={setPhone} />
                    <SelectorInput label="Gender" options={genderOptions} value={gender} setValue={setGender} />
                  </FormRow>
                  <FormRow>
                    <DateInput label="Birthday" value={bday} setValue={setBDay} />
                    <TextInput label="Zipcode" value={zipcode} setValue={setZipcode} />
                  </FormRow>
                </FormGroup>
                <div className="d-flex justify-content-center">
                  <button type="button" className="btn btn-primary-blue" onClick={saveProfile}>
                    Save Profile
                  </button>
                </div>
              </Form>
              <br />
              <br />
            </div>
          </div>
        </main>
      )}
    </>
  );
};
