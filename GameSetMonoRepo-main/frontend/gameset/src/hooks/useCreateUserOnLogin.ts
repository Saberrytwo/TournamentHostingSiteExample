import { getCurrentUser } from "@aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useEffect, useState } from "react";
import { User } from "../types/user";
import { useAppDispatch } from "./hooks";
import { userApi } from "../store/apis/userApi";
import { fetchUserAttributes } from "aws-amplify/auth";
import { toast } from "react-toastify";

async function handleFetchUserAttributes() {
  try {
    const userAttributes = await fetchUserAttributes();
    return userAttributes;
  } catch (error) {
    toast.error("An error occurred with the user.", {
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

export const useCreateUserOnLogin = () => {
  const [loginState, setLoginState] = useState<any>("signedOut");
  const dispatch = useAppDispatch();

  Hub.listen("auth", ({ payload }) => {
    switch (payload.event) {
      case "signedIn":
        setLoginState("signedIn");
        break;
      case "signedOut":
        setLoginState(0);
        break;
    }
  });

  const handleCreateUser = async (newUser: User) => {
    try {
      // No need to await a response object since the API does not return the created user
      const result = await dispatch(userApi.endpoints.createUser.initiate(newUser)).unwrap();
    } catch (err) {
      // Handle errors, e.g., show error messages
      toast.error("There was a problem creating a user", {
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

  useEffect(() => {
    const createNewUser = async () => {
      const { userId, username } = await getCurrentUser();
      if (loginState === "signedIn") {
        const result = await dispatch(userApi.endpoints.GetUserById.initiate(userId)).unwrap();
        if (!result.length) {
          const cognitoInfo: any = await handleFetchUserAttributes();
          await handleCreateUser(
            new User({
              userID: userId,
              userName: username,
              firstName: cognitoInfo.given_name ?? cognitoInfo.name ?? "",
              lastName: cognitoInfo.family_name,
              email: cognitoInfo.email,
              imageURL: cognitoInfo?.picture ?? null,
              birthdate: cognitoInfo?.birthdate ?? null,
              phoneNumber: cognitoInfo?.phone_number ?? null,
            })
          );
        }
      }
    };

    createNewUser();
  }, [loginState]);
};

function delay(timeInMs) {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
}
