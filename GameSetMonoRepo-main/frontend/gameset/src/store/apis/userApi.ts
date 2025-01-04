import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../types/user";

const BASE_URL =
  import.meta.env.VITE_ENVIRONMENT === "Development" ? import.meta.env.VITE_API_DEV : import.meta.env.VITE_API_PROD;

interface CreateUserResponse {
  message: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["TeamData"],
  endpoints: (builder) => ({
    GetUsers: builder.query({
      query: () => `User/GetUsers`,
    }),
    GetUserById: builder.query<User[], string>({
      query: (userId) => `User/GetUserByID?userId=${userId}`,
    }),
    createUser: builder.mutation<CreateUserResponse, Partial<User>>({
      query: (newUser) => ({
        url: "User/CreateUser",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      }),
    }),
    UpdateUser: builder.mutation<number, { User: User }>({
      query: (updateUserDetails) => ({
        url: `User/UpdateUser`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: updateUserDetails,
      }),
    }),
    // DeleteUser: builder.mutation<{ success: boolean; id: string }, string>({
    //   query: (userId) => ({
    //     url: `User/DeleteUser/${userId}`,
    //     method: 'DELETE',
    //   }),
    // }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  //   useDeleteUserMutation,
} = userApi;
