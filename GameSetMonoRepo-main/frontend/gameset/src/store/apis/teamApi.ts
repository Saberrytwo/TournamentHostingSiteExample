import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  import.meta.env.VITE_ENVIRONMENT === "Development" ? import.meta.env.VITE_API_DEV : import.meta.env.VITE_API_PROD;

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["TeamData"],
  endpoints: (builder) => ({
    CreateTeam: builder.mutation<number, { Team: Team; UserID: string; UserIDs: string[] }>({
      invalidatesTags: ["TeamData"],
      // note: an optional `queryFn` may be used in place of `query`
      query: ({ Team, UserID, UserIDs }) => ({
        url: "Team/CreateTeam",
        method: "POST",
        body: { Team, UserID, UserIDs },
      }),
    }),
    UpdateTeam: builder.mutation<number, { Team: Team; UserIDs: string[] }>({
      invalidatesTags: ["TeamData"],
      // note: an optional `queryFn` may be used in place of `query`
      query: ({ Team, UserIDs }) => ({
        url: "Team/UpdateTeam",
        method: "POST",
        body: { Team, UserIDs },
      }),
    }),
    AddUserToTeam: builder.mutation<number, { TeamID: number; UserID: number }>({
      // note: an optional `queryFn` may be used in place of `query`
      query: ({ TeamID, UserID }) => ({
        url: "Team/AddUserToTeam",
        method: "POST",
        body: { TeamID, UserID },
      }),
    }),
    ListUserTeamsByUserID: builder.query<UserTeamStatus[], { UserID: string }>({
      providesTags: ["TeamData"],
      query: ({ UserID }) => `Team/GetUserTeamsByUserId?UserID=${UserID}`,
    }),
    GetTeamByTeamID: builder.query<TeamWithUsers, { TeamID: number }>({
      providesTags: ["TeamData"],
      query: ({ TeamID }) => `Team/GetTeamByTeamID?TeamID=${TeamID}`,
    }),
    ListTeamsByUserID: builder.query<Team[], { UserID: string }>({
      query: ({ UserID }) => `Tournament/GetTeamsByUserId?UserID=${UserID}`,
      providesTags: ["TeamData"],
    }),
  }),
});

export const {
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useAddUserToTeamMutation,
  useListUserTeamsByUserIDQuery,
  useGetTeamByTeamIDQuery,
  useListTeamsByUserIDQuery,
} = teamApi;
