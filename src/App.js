import "./App.css";

import React, { useEffect, useState } from "react";

import Chessground from "react-chessground";
import "react-chessground/dist/styles/chessground.css";
const fetch = require("node-fetch");

const { flat } = require("chess-moments");
// https://github.com/victorocna/chess-moments

const headers = {
  Authorization: "Bearer " + process.env.REACT_APP_LICHESS_TOKEN,
};

const STUDIES = [
  "https://lichess.org/api/study/b8qObtrF.pgn",
  "https://lichess.org/api/study/RVw9HG6u.pgn",
  "https://lichess.org/api/study/4qne3IGN.pgn",
  "https://lichess.org/api/study/bvh2Oo1d.pgn",
  "https://lichess.org/api/study/iHi0fZL5.pgn",
  "https://lichess.org/api/study/0HVU30G3.pgn",
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
        let orientation = "white";

        if (chapter.includes('[Event "BLACK')) {
          orientation = "black";
        }

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
          return { ...m, previousFen, orientation };
        });

        keyPositions.push(augmentedMoments);
      });

      return keyPositions.flat();
    });
  });

function App() {
  const [keyMoves, setKeyMoves] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const moves = await Promise.all(STUDIES.map(fetchKeyMoves));
      setKeyMoves(moves.flat());
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <div style={{ paddingTop: 20 }}>Key moves: {keyMoves.length}</div>
      <div style={{ marginTop: 30 }}>
        <button
          onClick={() => {
            setShowAnswer(false);
            setKeyMoves([...keyMoves.slice(1, keyMoves.length), keyMoves[0]]);
          }}
        >
          ❎
        </button>
        <button
          style={{ marginLeft: 10 }}
          onClick={() => {
            setShowAnswer(false);
            setKeyMoves(keyMoves.slice(1, keyMoves.length));
          }}
        >
          ✅
        </button>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: 50,
        }}
      >
        <Chessground
          fen={keyMoves[0] && keyMoves[0].previousFen}
          orientation={keyMoves[0] && keyMoves[0].orientation}
          highlight={{ lastMove: false }}
          onMove={() => {
            setShowAnswer(true);
          }}
        />
      </div>
      <div style={{ marginTop: 30 }}>
        {showAnswer && keyMoves[0] && keyMoves[0].move}
      </div>
    </div>
  );
}

export default App;
