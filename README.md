# Study and Custom RTK

## createAsyncThunk function dive in.

```ts AsyncThunkConfig
export type AsyncThunkConfig = {
  state?: unknown;
  dispatch?: ThunkDispatch<unknown, unknown, UnknownAction>;
  extra?: unknown;
  rejectValue?: unknown;
  serializedErrorType?: unknown;
  pendingMeta?: unknown;
  fulfilledMeta?: unknown; // to manually custom payload AND custom meta
  rejectedMeta?: unknown; // to manually custom error payload and custom meta
};
```

Return type

```ts
function createAsyncThunk<
  Returned, // The Generic Type
  ThunkArg, // The Generic Type
  ThunkApiConfig extends AsyncThunkConfig
>
```

Params

```ts
function createAsyncThunk(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>,
  options?: AsyncThunkOptions<ThunkArg, ThunkApiConfig>,
);
```

- typePrefix: should be use at: typePrefix + "/fulfilled", typePrefix + "/pending", typePrefix + "/rejected",

- payloadCreator: That the callback function to define logic of async function dive in this later.

- options: <ThunkArg = void, ThunkApiConfig extends AsyncThunkConfig = {}>

- condition: (arg: ThunkArg, api: { getState, extra }) => boolean | Promise<boolean>: return the condition to execute the async method.

- dispatchConditionRejection: boolean => should dispatch the RejectFunction on condition failure or not

- idGenerator: (arg: ThunkArg) => string: return the custom Id for createAsyncThunk instance

- serializeError: (error: unknown) => any: custom error

- getPendingMeta: ({ arg, requestId }, api: { getState, extra }) => any => Add extra information to meta on pending action

## RTKQ

### createApi function dive in.

#### Required params

- reducerPath
- baseQuery
- endpoints

Component
↓ (calls hook)
Endpoint
↓ (returns request config)
baseQuery
↓ (executes request)
Redux store (reducerPath)

##### reducerPath:

- reducerPath is the unique key under which RTK Query stores its cache, metadata, and state inside the Redux store.

##### baseQuery:

- baseQuery is the single source of truth for network behavior in RTK Query.
- baseQuery is a standardized request executor that endpoints delegate to, responsible for performing network calls and normalizing results and errors.

- BaseQuery implements the actual request execution (using Fetch API by default).
- It uses the baseUrl plus the request details returned by an endpoint.
- When an endpoint is called, RTK Query invokes baseQuery to perform the HTTP request.

##### endpoints:

- Endpoints are declarative API contracts that define the data operations of your app, which RTK Query translates into hooks, cache entries, and store updates—executed via baseQuery and stored under reducerPath.

```ts
 endpoints(
    build: EndpointBuilder<BaseQuery, TagTypes, ReducerPath>,
  ): Definitions
```

```ts
export type EndpointDefinitions = Record<
  string,
  EndpointDefinition<any, any, any, any, any, any, any>
>;
```

- The `QueryDefinition` should be under type of `QueryDefinition | MutationDefinition | InfiniteQueryDefinition`

- We can imagine as `Query = state && Mutation = event`

- As we can see here. The `EndpointDefinitions` hold the Record with the <string, EndpointDefinition> so we able to defined multiple endpoint-methods inside endpoints options.
  EX:

```ts
{
  getMenus: QueryDefinition<...>,
  createMenu: MutationDefinition<...>
}
```

Endpoint lifecycle (onQueryStarted)
Cache keys & argument serialization
Pagination & infinite queries
Why RTK Query discourages “service-per-feature”
