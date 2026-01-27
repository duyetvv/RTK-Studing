import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../../app/store";
import { generateAsyncThunk } from "../../utils/generateAsyncThunk";
import { httpGet } from "../../services/apiService";

import type { Pokemon, PokemonParams, PokemonResponse } from "./types";

export const fetchPokemon = generateAsyncThunk<
  PokemonResponse,
  PokemonParams,
  RootState
>("pokemon/fetchPokemon", "https://pokeapi.co/api/v2/pokemon", httpGet);

// Define a type for the slice state
interface PokemonState {
  loading: boolean;
  data: Pokemon[] | null;
  error: any;
}

// Define the initial state using that type
const initialState: PokemonState = {
  loading: false,
  data: null,
  error: null,
};

export const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemon.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.results;
      })
      .addCase(fetchPokemon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const {} = pokemonSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPokemonLoading = (state: RootState) => state.pokemon.loading;
export const selectPokemonData = (state: RootState) => state.pokemon.data;
export const selectPokemonError = (state: RootState) => state.pokemon.error;

export default pokemonSlice.reducer;
