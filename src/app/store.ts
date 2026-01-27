import { configureStore } from "@reduxjs/toolkit";

import asyncRequestsReducer from "./asyncRequestsSlice";
import counterReducer from "../features/counter/slice";
import pokemonReducer from "../features/pokemon/slice";
import { menuApi } from "../features/studyRTKQuery/services";


export const store = configureStore({
  reducer: {
    asyncRequests: asyncRequestsReducer,
    counter: counterReducer,
    pokemon: pokemonReducer,
    [menuApi.reducerPath]: menuApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(menuApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
