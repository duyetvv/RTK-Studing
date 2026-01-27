// src/app/inFlightRequestsSlice.ts
import {
  createSlice,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";

type RequestInfo = {
  url: string;
  arg: any;
  loading: boolean;
};

export type ActionPayload = {
  reducerPath: string;
  arg: RequestInfo;
};

type AsyncRequest = {
  [key: string]: RequestInfo | undefined;
};

const initialState: AsyncRequest = {};

const asyncRequests = createSlice({
  name: "asyncRequests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher<ActionPayload>(isPending, (state, action) => {
        const reducerPath = action.type.replace("/pending", "");
        state[reducerPath] = { ...action.arg, loading: true };
      })
      .addMatcher<ActionPayload>(isFulfilled, (state, action) => {
        const reducerPath = action.type.replace("/fulfileed", "");
        state[reducerPath] = { ...action.arg, loading: false };
      })
      .addMatcher<ActionPayload>(isRejected, (state, action) => {
        const reducerPath = action.type.replace("/rejected", "");
        state[reducerPath] = { ...action.arg, loading: false };
      });
  },
});

export default asyncRequests.reducer;
