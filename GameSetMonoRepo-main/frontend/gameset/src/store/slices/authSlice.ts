import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User } from "../../types/user";
// Define a type for the slice state
interface authState {
  token: string | null;
  isLoggedIn: boolean;
  loaded: boolean;
  user: Record<string, any>;
}

// Define the initial state using that type
const initialState: authState = {
  user: User.createNullUser().serialize(),
  token: null,
  isLoggedIn: false,
  loaded: false,
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const accessToken = action.payload;
      state.token = accessToken;
    },

    setUser: (state, action) => {
      const user = action.payload;
      state.user = user;
      state.loaded = true;
    },

    logOut: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.user = User.createNullUser();
      state.loaded = false;
    },
    logIn: (state, action) => {
      state.token = action.payload;
      state.isLoggedIn = true;
      state.loaded = true;
    },
  },
});

export const { setCredentials, setUser, logOut, logIn } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;

export default authSlice.reducer;
