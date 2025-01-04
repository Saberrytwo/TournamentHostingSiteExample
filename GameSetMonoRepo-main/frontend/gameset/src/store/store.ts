import { configureStore } from "@reduxjs/toolkit";
import { api } from "./apis/authApi";
import { tournamentApi } from "./apis/tournamentApi";
import { userApi } from "./apis/userApi";
import { teamApi } from "./apis/teamApi";
import authReducer from "./slices/authSlice";

// ...

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [tournamentApi.reducerPath]: tournamentApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(tournamentApi.middleware)
      .concat(teamApi.middleware)
      .concat(userApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
