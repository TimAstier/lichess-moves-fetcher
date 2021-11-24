require("dotenv").config();
const fetch = require("node-fetch");
const { Chess } = require("chess.js");

const chess = new Chess();

const headers = {
  Authorization: "Bearer " + process.env.lichessToken,
};

const ALL_STUDIES_URL = "https://lichess.org/study/by/TimAstier/export.pgn";
const ONE_STUDY_URL = "https://lichess.org/api/study/RVw9HG6u.pgn";

fetch(ONE_STUDY_URL, { headers }).then((res) => {
  res.text().then((pgn) => {
    console.log(pgn);
    chess.load_pgn(pgn);
    // console.log(chess.ascii());
    // console.log(chess.fen());
    console.log(chess.get_comments().filter((a) => a.comment.includes("KEY")));
    console.log("done");
  });
});
