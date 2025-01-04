import { fetchAuthSession, getCurrentUser } from "@aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useEffect, useState } from "react";
import { userApi } from "../store/apis/userApi";
import { logIn, logOut, setUser } from "../store/slices/authSlice";
import { User } from "../types/user";
import { useAppDispatch } from "./hooks";
import { fetchUserAttributes } from "aws-amplify/auth";
import { combineSlices } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const useFetchUser = () => {
  const [authEvent, setAuthEvent] = useState<any>();

  const dispatch = useAppDispatch();

  async function handleFetchUserAttributes() {
    try {
      const userAttributes = await fetchUserAttributes();
      return userAttributes;
    } catch (error) {
      toast.error("Something went wrong with the user.", {
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

  const fetchUser = async (userId: string, username: string) => {
    try {
      const result = await dispatch(userApi.endpoints.GetUserById.initiate(userId)).unwrap();
      if (result.length) {
        dispatch(setUser(result[0]));
      } else {
        const cognitoInfo: any = await handleFetchUserAttributes();
        dispatch(
          setUser(
            new User({
              userID: userId,
              userName: username,
              firstName: cognitoInfo.given_name ?? cognitoInfo.name ?? "",
              lastName: cognitoInfo.family_name,
              email: cognitoInfo.email,
              imageURL: cognitoInfo?.picture ?? null,
              zipcode: "",
              gender: "",
              birthdate: cognitoInfo?.birthdate ?? null,
              phoneNumber: cognitoInfo?.phone_number ?? null,
            })
          )
        );
      }
      // TypeScript should know the type of `result` here
    } catch (error) {
      toast.error("User not found", {
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

  Hub.listen("auth", (data) => {
    setAuthEvent(data);
  });

  useEffect(() => {
    const currentAuthenticatedUser = async () => {
      try {
        const { userId, username } = await getCurrentUser();
        const { idToken } = (await fetchAuthSession()).tokens ?? {};

        logIn(idToken?.toString());

        await fetchUser(userId, username);
      } catch (err) {
        logOut();
      }
    };

    currentAuthenticatedUser();
  }, [authEvent]);
};
