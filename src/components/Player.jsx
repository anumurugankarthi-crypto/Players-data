import React, { useState, useMemo, useEffect } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const PAGE_SIZE = 20;

export default function PlayersDirectory() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    fetch("/Player.json")
      .then((res) => res.json())
      .then(setPlayers);
  }, []);

  const isMobile = window.innerWidth < 768;

  const filtered = useMemo(() => {
    let list = players;

    if (activeLetter) {
      list = list.filter((p) =>
        p.lastName.toUpperCase().startsWith(activeLetter)
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.fullName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [players, search, activeLetter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div style={{
      fontFamily: "Segoe UI",
      width: "100%",
      minHeight: "100vh",
      margin: 0,
      padding: 0
    }}>

      {/* 🔥 FIXED STICKY STACK (HEADER + ALPHABET) */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}>

        {/* HEADER */}
        <div style={{
          background: "#161642",
          padding: 12,
          display: "flex",
          justifyContent: "space-between"
        }}>
          <h3 style={{ color: "#fff", fontSize: isMobile ? 14 : 18 }}>Players</h3>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: 4,
              width: "100%",
              maxWidth: 200,
              height: "20px"
            }}
          />
        </div>

        {/* ALPHABET */}
        <div style={{
          display: "flex",
          overflowX: "auto",
          padding: 8,
          fontSize: isMobile ? 10 : 12,
          background: "#6d6e71"
        }}>
          {ALPHABET.map((l) => (
            <button
              key={l}
              onClick={() => setActiveLetter(l)}
              style={{
                margin: "0 6px",
                minWidth: isMobile ? 22 : 28,
                height: isMobile ? 22 : 28,
                fontSize: isMobile ? 10 : 12,
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              {l}
            </button>
          ))}
        </div>

      </div>

      {/* TABLE */}
      <div style={{ padding: 10 }}>

        {/* HEADER */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr"
            : "2fr 1fr 1fr 1fr 1fr 1fr 1fr",
          fontWeight: "bold",
          fontSize: isMobile ? 10 : 12
        }}>
          <div>PLAYER PROFILE</div>
          <div>TEAM</div>
          <div>POS</div>
          <div>HT</div>
          <div>WT</div>
          <div>EXP</div>
          <div>COUNTRY</div>
        </div>

        {/* ROWS */}
        {pageItems.map((p, idx) => (
          <div
            key={p.playerId}
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr"
                : "2fr 1fr 1fr 1fr 1fr 1fr 1fr",
              padding: isMobile ? 6 : 10,
              fontSize: isMobile ? 11 : 14,
              background: idx % 2 ? "#f9f9f9" : "#fff",
              alignItems: "center"
            }}
          >
            {/* PLAYER COLUMN */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10
            }}>
              <button
                onClick={() => setSelectedPlayer(p)}
                style={{
                  width: isMobile ? 24 : 30,
                  height: isMobile ? 24 : 30,
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                  background: "#f4f6f8",
                  fontSize: isMobile ? 10 : 11,
                  cursor: "pointer"
                }}
              >
                👁
              </button>

              <span>
                {p.firstName} {p.lastName}
              </span>
            </div>

            <div>{p.teamShort}</div>
            <div>{p.positionShort}</div>
            <div>{p.heightDisplay}</div>
            <div>{p.weightLbs}</div>
            <div>{p.experience}</div>
            <div>{p.country}</div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        background: "#fff",
        display: "flex",
        justifyContent: "center",
        padding: 10
      }}>
        <button onClick={() => setPage(page - 1)}>Prev</button>
        <span style={{ margin: "0 10px" }}>
          {page} / {totalPages}
        </span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>

      {/* MODAL */}
      {selectedPlayer && (
        <div
          onClick={() => setSelectedPlayer(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 12,
              width: "90%",
              maxWidth: 600,
              padding: 24,
              position: "relative"
            }}
          >
            <button
              onClick={() => setSelectedPlayer(null)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                border: "none",
                background: "transparent",
                fontSize: 18,
                cursor: "pointer"
              }}
            >
              ✕
            </button>

            <h3>{selectedPlayer.fullName}</h3>

            <p>Age: {selectedPlayer.age}</p>
            <p>College: {selectedPlayer.college}</p>
            <p>Draft: {selectedPlayer.draftYear}</p>
            <p>Height: {selectedPlayer.heightCm} cm</p>
            <p>Weight: {selectedPlayer.weightKg} kg</p>
          </div>
        </div>
      )}
    </div>
  );
}