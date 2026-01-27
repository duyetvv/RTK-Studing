/**
 * The 6 Core Concepts (this is the foundation)
 * API Slice = Data Layer
 * Endpoints, not Thunks
 * Cache Key = (endpoint + args)
 * Hooks are just a UI layer
 * Cache Lifecycle (the magic)
 * Normal Redux is still there
 */

/**
 * Let Do research more about that one
  1. RTK Query architecture (internals)
	2. First API slice (Pokemon example)
	3. Cache invalidation (most important part)
	4. Advanced patterns (pagination, polling)
	5. RTK Query vs AsyncThunk (decision matrix)
 */

/**
 * RTK Query Architecture (Internals)
 * 
┌──────── React Hooks (optional) ───────┐
│ useGetXQuery / useMutation            │
└───────────────▲───────────────────────┘
                │ subscribes             
┌───────────────┴───────────────────────┐
│   RTK Query Cache Layer (Redux)       │
│   - queries                           │
│   - mutations                         │
│   - subscriptions                     │
│   - tags                              │
└───────────────▲───────────────────────┘
                │ dispatches actions.    
┌───────────────┴───────────────────────┐
│  Middleware (the engine)              │
│  - deduplication                      │
│  - request lifecycle                  │
│  - abort / retry                      │
│  - polling                            │
└───────────────▲───────────────────────┘
                │ calls                  
┌───────────────┴───────────────────────┐
│  baseQuery (fetchBaseQuery / custom)  │
│  - actual network request             │
└───────────────────────────────────────┘
 */
// Need to use the React-specific entry point to import createApi

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export interface Menu {
  id: number; // mockapi usually returns string ids
  path: string;
  label: string;
}

/** This step to create the API for the menu
 * Next steps
 - Add mutation (create/update menu)
 - Learn tag invalidation deeply
 - Handle pagination / params
 - Compare RTK Query vs AsyncThunk in real apps
 */
export const menuApi = createApi({
  reducerPath: "menuApi", // unique key in Redux store

  baseQuery: fetchBaseQuery({
    baseUrl: "https://5c36c16b6fc11c0014d330a8.mockapi.io/api/v1",
  }),

  tagTypes: ["Menu"],

  endpoints: (builder) => ({
    getMenus: builder.query<Menu[], void>({
      query: () => "/menus",
      providesTags: ["Menu"],
    }),
    getMenuById: builder.query<Menu, number>({
      query: (id) => `/menus/${id}`,
      providesTags: (_, __, id) => [{ type: "Menu", id }],
    }),
    createMenu: builder.mutation<Menu, Partial<Menu>>({
      query: (body) => ({
        url: "/menus",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Menu"],
    }),
    deleteMenu: builder.mutation<void, number>({
      query: (id) => ({
        url: `/menus/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Menu", id }],
    }),
  }),
});

export const {
  useGetMenusQuery,
  useGetMenuByIdQuery,
  useCreateMenuMutation,
  useDeleteMenuMutation,
} = menuApi;
