require("dotenv").config();
const fetch = require("node-fetch");

const { flat } = require("chess-moments");

const headers = {
  Authorization: "Bearer " + process.env.lichessToken,
};

const ALL_STUDIES_URL = "https://lichess.org/study/by/TimAstier/export.pgn";
const ONE_STUDY_URL = "https://lichess.org/api/study/RVw9HG6u.pgn";

fetch(ONE_STUDY_URL, { headers }).then((res) => {
  res.text().then((pgn) => {
    const pgns = pgn.split(/(\[Event)/);
    // console.log(pgns);
    const firstPgn = `${pgns[1]}${pgns[2]}`;
    const moments = flat(firstPgn);
    const filteredMoments = moments.filter((m) => {
      if (m.comment === undefined) {
        return false;
      }
      return m.comment.includes("*KEY*");
    });
    console.log(filteredMoments);
    console.log("done");
  });
});
