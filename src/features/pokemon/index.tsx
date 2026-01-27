import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { fetchPokemon } from "./slice";

function Pokemon() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.pokemon
  );

  useEffect(() => {
    dispatch(fetchPokemon({ name: "test" }));
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>This demonstrated for createAsyncThunk</h2>
      <ul>{data && data.map((p) => <li key={p.name}>{p.name}</li>)}</ul>
    </div>
  );
}

export default Pokemon;
