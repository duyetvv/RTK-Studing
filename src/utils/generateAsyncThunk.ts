import { createAsyncThunk, type GetThunkAPI } from "@reduxjs/toolkit";
import type { HttpCaller } from "../services/apiService";

// _______________________________________________________
//#region Defined the necessary types for createAsyncThunk
// _______________________________________________________

/**
 * Custom configuration for the Redux Toolkit thunk middleware.
 * Specifies custom types for state, reject value, and meta payloads.
 * @template TState The type of the Redux state.
 */
type ApiConfig<TState> = {
  state: TState;
  rejectValue: string;
  pendingMeta: unknown;
  fulfilledMeta: unknown;
  rejectedMeta: unknown;
};

/**
 * A specialized version of the `GetThunkAPI` type that uses our custom `ThunkApiConfig`.
 * @template TState The type of the Redux state.
 */
type GetThunkAPIState<TState> = GetThunkAPI<ApiConfig<TState>>;

/**
 * A function type for a selector that retrieves a loading status from the Redux state.
 * @template TState The type of the Redux state.
 * @param {TState} state The Redux state object.
 * @returns {boolean} The loading status.
 */
export type GetStateLoading<TState> = (state: TState) => boolean;

//#endregion

// _______________________________________________________
// #region Defined the components of createAsyncThunk params
// There are 3 main components of params
// 1: typePrefix: defined the Action_Type
// 2: payloadCreator: Defined the Action_Function
// 3: options: defined the custom options from CustomThunkArg and CustomApiConfig
// Should split the Async calling action to another function
// _______________________________________________________

/**
 * A factory function that generates the `payloadCreator` for `createAsyncThunk`.
 * The returned function handles the actual asynchronous logic, like making an API call.
 * @template ReturnedType The expected return type of the API call.
 * @template ArgType The type of the argument passed to the thunk action.
 * @template State The type of the Redux state.
 * @param {string} apiUrl The URL endpoint for the API call.
 * @param {HttpCaller} httpCaller The HTTP function (e.g., httpGet, httpPost) to use for the API call.
 * @returns The `payloadCreator` async function.
 */
const genPayloadCreator =
  <TReturned, TArgument, TState>(apiUrl: string, httpCaller: HttpCaller) =>
  async (thunkArg: TArgument, api: GetThunkAPIState<TState>) => {
    const { fulfillWithValue, rejectWithValue } = api;

    try {
      // Makes the actual API call using the provided httpCaller
      const data = await httpCaller(apiUrl, thunkArg);
      // On success, `fulfillWithValue` dispatches a `fulfilled` action with the data
      return fulfillWithValue(data as TReturned);
    } catch (err: any) {
      // On failure, `rejectWithValue` dispatches a `rejected` action with the error message
      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown error",
      );
    }
  };

/**
 * A factory function that generates the `options` object for `createAsyncThunk`.
 * This allows for customizing the thunk's behavior, such as preventing duplicate requests.
 * @template ArgType The type of the argument passed to the thunk action.
 * @template State The type of the Redux state.
 * @param {GetStateLoading<TState>} [selectLoading] A selector function to check if a request is already in progress.
 * @returns The `options` object for `createAsyncThunk`.
 */
const genOptions = <TArgument, TState>() => ({
  // This function runs before the payload creator.
  getPendingMeta: (
    base: {
      arg: TArgument;
      requestId: string;
    },
    api: GetThunkAPIState<TState>,
  ) => {
    console.log("getPendingMeta ", base, api);

    return {};
  },
  /**
   * This function runs before the payload creator. If it returns false, the thunk is cancelled.
   * It's used here to prevent dispatching a new action if a request is already loading.
   */
  condition: (
    arg: TArgument,
    api: GetThunkAPIState<TState>,
  ): boolean | Promise<boolean> => {
    /**
     * That one might be cancel the The first of 2 requests
     * That the next has the same reducerPath but carry the differenet Arg
     * Using the cache with the ReducerPath + Url
     */
    console.log("condition arg ", arg);
    console.log("condition api ", api);

    const state = api.getState() as any;
    if (state.asyncRequests) {
      console.log("condition asyncRequests ", state.asyncRequests, );
    }
    // This one need to do some comparison from the args to ensure the
    // diff args of the same action should be execute without the mistake
    // Use JSON.stringify() the args object to detect that one
    // Use cacheKey = endpointName + serializedArgs Copy idea from the RTKQ

    // Only run the thunk if not already loading
    return true;
  },
});

//#endregion

/**
 * A generic factory for creating a Redux Toolkit `asyncThunk`.
 * It abstracts away the boilerplate for defining the payload creator and options,
 * making it easy to create thunks for API calls.
 * @template ReturnedType The expected return type of the API call.
 * @template ArgType The type of the argument passed to the thunk action.
 * @template State The type of the Redux state slice this thunk belongs to.
 * @param {string} actionType The action type prefix (e.g., 'pokemon/fetchPokemon').
 * @param {string} url The URL endpoint for the API call.
 * @param {HttpCaller} httpCaller The HTTP function (e.g., httpGet, httpPost) to use.
 * @param {GetStateLoading<TState>} selectLoading A selector function to get the loading status from the state.
 * @returns A complete `asyncThunk` instance ready to be used in a Redux slice.
 */
export const generateAsyncThunk = <TReturned, TArgument, TState>(
  actionType: string,
  url: string,
  httpCaller: HttpCaller,
) => {
  return createAsyncThunk<
    TReturned, // return type
    TArgument, // argument type
    ApiConfig<TState> // config
  >(
    actionType,
    genPayloadCreator<TReturned, TArgument, TState>(url, httpCaller),
    genOptions<TArgument, TState>(),
  );
};
