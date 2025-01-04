import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SearchType } from "../../types/params/enums";

const BASE_URL =
  import.meta.env.VITE_ENVIRONMENT === "Development" ? import.meta.env.VITE_API_DEV : import.meta.env.VITE_API_PROD;

export const tournamentApi = createApi({
  reducerPath: "tournamentApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: [
    "BracketMatches",
    "TournamentData",
    "UsersData",
    "TournamentDetails",
    "PoolPlayMatches",
    "pools",
    "ListTournaments",
    "ListRegistrationsForTournament",
    "BracketRegistrations",
    "TournamentTeams",
  ],
  endpoints: (builder) => ({
    ListTournaments: builder.query<
      TournamentsWithRegistrations,
      {
        lat: number;
        lng: number;
        distance: number;
        searchType: SearchType;
        userID: string;
      }
    >({
      query: ({ lat, lng, distance, searchType, userID }) =>
        `Tournament/GetTournaments?lat=${lat}&lng=${lng}&Distance=${distance}&SearchType=${searchType}&UserID=${userID}`,
      providesTags: ["ListTournaments"],
      transformResponse: (response: { item1; item2 }) => {
        return { tournaments: response.item1, registrationLists: response.item2 };
      },
    }),
    Register: builder.mutation<number, { TeamID: number; TournamentID: number; DivisionID: number }>({
      // note: an optional `queryFn` may be used in place of `query`
      query: ({ TeamID, TournamentID, DivisionID }) => ({
        url: "Tournament/Register",
        method: "POST",
        body: { TeamID, TournamentID, DivisionID },
      }),
      invalidatesTags: [
        "ListRegistrationsForTournament",
        "TournamentData",
        "UsersData",
        "ListRegistrationsForTournament",
        "ListTournaments",
        "TournamentDetails",
        "TournamentTeams",
      ],
    }),
    ListDivisionsForTournament: builder.query<Division[], { TournamentID: number }>({
      query: ({ TournamentID }) => `Tournament/GetDivisionsByTournamentID?TournamentID=${TournamentID}`,
    }),

    GetTournamentDetails: builder.query<any, { TournamentID: number }>({
      query: ({ TournamentID }) => `Tournament/GetAllTournamentData?TournamentID=${TournamentID}`,
      providesTags: ["TournamentDetails"],
    }),

    CreateTournament: builder.mutation<Tournament, TournamentBody>({
      query: (body) => ({
        url: "Tournament/CreateTournamentAndTournamentDivisions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TournamentDetails", "ListTournaments"],
    }),

    UpdateTournamentAndTournamentDivisions: builder.mutation<string, TournamentBody>({
      query: (body) => ({
        url: "Tournament/UpdateTournamentAndTournamentDivisions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TournamentDetails", "ListTournaments"],
    }),

    UpdateTournamentStatus: builder.mutation<number, { TournamentID: number; StatusID: Number }>({
      query: ({ TournamentID, StatusID }) => ({
        url: "Tournament/UpdateTournamentStatus",
        method: "POST",
        body: { TournamentID, StatusID },
      }),
      invalidatesTags: ["TournamentDetails", "ListTournaments"],
    }),

    ListDivisions: builder.query<Division[], {}>({
      query: () => `Division/GetDivisions`,
    }),

    ListPoolPlayMatches: builder.query<Match[], { TournamentDivisionID: number }>({
      providesTags: ["PoolPlayMatches"],
      query: ({ TournamentDivisionID }) =>
        `Tournament/GetPoolPlayMatchesWithUsers?TournamentDivisionID=${TournamentDivisionID}`,
    }),

    ListTournamentAdmins: builder.query<TournamentAdmin[], { TournamentID: number }>({
      query: ({ TournamentID }) => `Tournament/GetTournamentAdminByTournamentID?TournamentID=${TournamentID}`,
    }),

    ListTeamsForTournamentDivision: builder.query<Registration[], { TournamentDivisionID: number }>({
      providesTags: ["TournamentTeams"],
      query: ({ TournamentDivisionID }) =>
        `Tournament/GetRegistrationsByTournamentDivisionID?TournamentDivisionID=${TournamentDivisionID}`,
    }),

    ListMatchesForTournamentDivision: builder.query<Match[], { TournamentDivisionID: number }>({
      providesTags: ["BracketMatches"],
      query: ({ TournamentDivisionID }) =>
        `Tournament/GetMatchesByTournamentDivisionID?TournamentDivisionID=${TournamentDivisionID}`,
    }),

    SetScoreForMatch: builder.mutation<number, { matchID: number; score1: number | null; score2: number | null }>({
      invalidatesTags: ["BracketMatches", "PoolPlayMatches"],
      query: ({ matchID, score1, score2 }) => ({
        url: "Tournament/UpdateScoreForMatch",
        method: "POST",
        body: { matchID, score1, score2 },
      }),
    }),

    ListDivisionTeamsByTournamentID: builder.query<Map<string, TeamWithUsers[]>, { TournamentID: number }>({
      query: ({ TournamentID }) => `Tournament/GetTeamsAndDivisionsByTournamentID?TournamentID=${TournamentID}`,
    }),

    ListUsersByTournamentID: builder.query<User[], { TournamentID: number }>({
      providesTags: ["UsersData"],
      query: ({ TournamentID }) => `Tournament/GetUsersByTournamentID?TournamentID=${TournamentID}`,
    }),

    ListTournamentDivisions: builder.query<TournamentDivision[], { TournamentID: number }>({
      query: ({ TournamentID }) => `Tournament/GetTournamentDivisionsByTournamentID?TournamentID=${TournamentID}`,
    }),

    DeleteRegistrationByUserIDAndTournamentID: builder.mutation<void, { UserID: string; TournamentID: number }>({
      invalidatesTags: ["TournamentData", "UsersData", "ListRegistrationsForTournament"],
      query: ({ TournamentID, UserID }) => ({
        url: `Tournament/DeleteRegistrationByUserIDAndTournamentID?UserID=${UserID}&TournamentID=${TournamentID}`,
        method: "DELETE",
      }),
    }),

    ListTounamentStatuses: builder.query<TournamentStatus[], {}>({
      query: () => `Tournament/GetTournamentStatuses`,
    }),

    ListGroupsByTournamentDivisionID: builder.query<Group[], { TournamentDivisionID: number }>({
      query: ({ TournamentDivisionID }) =>
        `Tournament/GetGroupsByTournamentDivisionID?TournamentDivisionID=${TournamentDivisionID}`,
    }),

    CreateBracket: builder.mutation<void, { TournamentDivisionID: number }>({
      invalidatesTags: ["BracketMatches", "TournamentDetails"],
      query: ({ TournamentDivisionID }) => ({
        url: `Tournament/CreateBracketMatches?TournamentDivisionID=${TournamentDivisionID}`,
        method: "POST",
      }),
    }),

    ListGroupsRegistrations: builder.query<
      { groupList: Group[]; registrationList: Registration[] },
      { TournamentID: number }
    >({
      query: ({ TournamentID }) =>
        `Tournament/GetGroupsAndRegistrationsByTournamentDivisionID?TournamentDivisionID=${TournamentID}`,
    }),

    ListRegistrationsByTournamentDivisionID: builder.query<Registration[], { TournamentDivisionID: number }>({
      query: ({ TournamentDivisionID }) =>
        `Tournament/GetRegistrationsByTournamentDivisionID?TournamentDivisionID=${TournamentDivisionID}`,
      providesTags: ["BracketRegistrations"],
    }),

    ListGroupsRegistrationsByBracket: builder.query<
      { groupList: Group[]; registrationList: Registration[] },
      { TournamentID: number }
    >({
      providesTags: ["BracketRegistrations"],
      query: ({ TournamentID }) =>
        `Tournament/GetGroupsAndRegistrationsByTournamentDivisionIDByBracket?TournamentDivisionID=${TournamentID}`,
    }),

    UpdateGroups: builder.mutation<any, { tournamentDivisionID: string; groups: {} }>({
      invalidatesTags: ["pools"],
      query: (body) => ({
        url: `Tournament/CreatePoolPlayGroups`,
        method: "POST",
        body,
      }),
    }),
    ListTournamentByID: builder.query<Tournament, { TournamentID: Number }>({
      query: ({ TournamentID }) => `Tournament/GetTournamentByID?TournamentID=${TournamentID}`,
    }),

    ListRegistrationsForTournament: builder.query<Registration[], { TournamentID: number }>({
      query: ({ TournamentID }) => ({
        url: `Tournament/GetRegistrationsByTournamentID?TournamentID=${TournamentID}`,
        method: "GET",
      }),
      providesTags: ["ListRegistrationsForTournament"],
    }),
    CreatePoolPlayMatches: builder.mutation<any, { tournamentDivisionID: string }>({
      query: (body) => ({
        url: `Tournament/CreatePoolPlayMatches`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["TournamentDetails", "PoolPlayMatches"],
    }),
    InitializeBracketSeeds: builder.mutation<any, { tournamentDivisionID: string }>({
      query: (body) => ({
        url: `Tournament/InitializeBracketSeeds`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["BracketRegistrations"],
    }),
    SetBracketSeeds: builder.mutation<any, { tournamentDivisionID: string; RegistrationIDs: number[] }>({
      query: (body) => ({
        url: `Tournament/SetBracketSeeds`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useListTournamentsQuery,
  useRegisterMutation,
  useListTournamentDivisionsQuery,
  useGetTournamentDetailsQuery,
  useCreateTournamentMutation,
  useUpdateTournamentAndTournamentDivisionsMutation,
  useUpdateTournamentStatusMutation,
  useListDivisionsQuery,
  useListPoolPlayMatchesQuery,
  useListTournamentAdminsQuery,
  useListTeamsForTournamentDivisionQuery,
  useListMatchesForTournamentDivisionQuery,
  useSetScoreForMatchMutation,
  useListDivisionTeamsByTournamentIDQuery,
  useListUsersByTournamentIDQuery,
  useDeleteRegistrationByUserIDAndTournamentIDMutation,
  useListDivisionsForTournamentQuery,
  useListTounamentStatusesQuery,
  useListGroupsByTournamentDivisionIDQuery,
  useListGroupsRegistrationsQuery,
  useListGroupsRegistrationsByBracketQuery,
  useUpdateGroupsMutation,
  useCreateBracketMutation,
  useListRegistrationsByTournamentDivisionIDQuery,
  useListTournamentByIDQuery,
  useListRegistrationsForTournamentQuery,
  useCreatePoolPlayMatchesMutation,
  useInitializeBracketSeedsMutation,
  useSetBracketSeedsMutation,
} = tournamentApi;
