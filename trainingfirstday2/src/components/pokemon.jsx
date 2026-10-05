import { useEffect, useState } from "react";

export default function RandomPokemon() {
  const [pokemon, setPokemon] = useState(null);
  const [id, setId] = useState(200);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPokemon() {
      try {
        setLoading(true);
        const res = await fetch(`https://pokeapi.co/api/v2/item/${id}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setPokemon({
          name: data.name,
          effect: data.effect_entries[0].short_effect,
          url: data.sprites.default,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch Item:", err);
          setPokemon(null);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPokemon();

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    console.log(`✨ Pokémon ID changed to ${id}`);
    return () => console.log(`🧹 Cleaning up for Pokémon ID ${id}`);
  }, [id]);

  const nextPokemon = () => setId((n) => (n % 200) + 1);
  const prevPokemon = () => setId((n) => (n === 1 ? 200 : n - 1));

  // ✅ new input handler
  const handleInputChange = (e) => {
    const newId = parseInt(e.target.value, 10);
    if (!isNaN(newId) && newId > 0 && newId <= 200) {
      setId(newId);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: 24 }}>
      <h2>Pokémon ItemViewer ⚡</h2>

      {/* ✅ new input field */}
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="pokeId">Enter Pokémon Item ID : </label>
        <input
          id="pokeId"
          type="text"
          min="0"
          max="200"
          value={id}
          onChange={handleInputChange}
          style={{ width: 80, textAlign: "center" }}
        />
      </div>

      {loading ? (
        <p>Loading Pokémon Item...</p>
      ) : pokemon ? (
        <div
          className="pokemon-info"
          style={{
            border: "2px solid #e0e0e0",
            borderRadius: 12,
            padding: 16,
            display: "inline-block",
            backgroundColor: "#fafafa",
            color: "#333",
          }}
        >
          <img
            src={pokemon.url}
            alt={pokemon.name}
            width={120}
            height={120}
            style={{ imageRendering: "pixelated" }}
          />
          <h1 style={{ textTransform: "capitalize", color: "#000000" }}>{pokemon.name}</h1>
          <p>Description: {pokemon.effect}</p>
        </div>
      ) : (
        <p>No Pokémon Item found.</p>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={prevPokemon}>⬅️ Prev Item</button>
        <button onClick={nextPokemon}>Next Item ➡️</button>
      </div>
    </div>
  );
}
