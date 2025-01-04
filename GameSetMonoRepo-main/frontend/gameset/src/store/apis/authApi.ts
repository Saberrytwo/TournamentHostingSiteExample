import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
interface User {
  userID: string;
  userName: string;
  imageURL: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  birthdate: Date;
  zipcode: string;
  gender: string;
}

const BASE_URL =
  import.meta.env.VITE_ENVIRONMENT === "Development"
    ? import.meta.env.VITE_API_DEV
    : import.meta.env.VITE_API_PROD;

export const api = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    ListUsers: builder.query<User, void>({
      query: () => `User/GetUsers`,
    }),
  }),
});

export const { useListUsersQuery } = api;
