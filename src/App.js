import "./App.css";

import React, { useEffect, useState } from "react";

const fetch = require("node-fetch");

const { flat } = require("chess-moments");
// https://github.com/victorocna/chess-moments

const headers = {
  Authorization: "Bearer " + process.env.REACT_APP_LICHESS_TOKEN,
};

const STUDIES = [
  "https://lichess.org/api/study/RVw9HG6u.pgn",
  "https://lichess.org/api/study/4qne3IGN.pgn",
  "https://lichess.org/api/study/bvh2Oo1d.pgn",
  "https://lichess.org/api/study/iHi0fZL5.pgn",
  "https://lichess.org/api/study/0HVU30G3.pgn",
  "https://lichess.org/api/study/b8qObtrF.pgn",
];

const fetchKeyMoves = (studyUrl) =>
  fetch(studyUrl, { headers }).then((res) => {
    return res.text().then((pgn) => {
      const keyPositions = [];
      const chapters = [];

      const pgns = pgn.split(/(\[Event)/);
      pgns.shift();

      for (let i = 0; i < pgns.length; i = i + 2) {
        chapters.push(`${pgns[i]}${pgns[i + 1]}`);
      }

      chapters.forEach((chapter) => {
        const moments = flat(chapter);

        const filteredMoments = moments.filter((m, index) => {
          if (m.comment === undefined) {
            return false;
          }
          return m.comment.includes("*KEY*");
        });

        const augmentedMoments = filteredMoments.map((m) => {
          let previousFen = "";
          if (m.index > 0) {
            previousFen = moments[m.index - 1].fen;
          }
          return { ...m, previousFen };
        });

        keyPositions.push(augmentedMoments);
      });

      return keyPositions.flat();
    });
  });

function App() {
  const [keyMoves, setKeyMoves] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const moves = await Promise.all(STUDIES.map(fetchKeyMoves));
      setKeyMoves(moves.flat());
    };
    fetchData();
  }, []);

  return <div className="App">{keyMoves.length}</div>;
}

export default App;
