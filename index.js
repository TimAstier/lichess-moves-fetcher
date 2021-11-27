require("dotenv").config();
const fetch = require("node-fetch");

const { flat } = require("chess-moments");
// https://github.com/victorocna/chess-moments

const headers = {
  Authorization: "Bearer " + process.env.lichessToken,
};

const ALL_STUDIES_URL = "https://lichess.org/study/by/TimAstier/export.pgn";
const ONE_STUDY_URL = "https://lichess.org/api/study/RVw9HG6u.pgn";

fetch(ONE_STUDY_URL, { headers }).then((res) => {
  res.text().then((pgn) => {
    const pgns = pgn.split(/(\[Event)/);
    // TODO: Make this dynamic
    const firstChapter = `${pgns[1]}${pgns[2]}`;
    const secondChapter = `${pgns[3]}${pgns[4]}`;
    const thirdChapter = `${pgns[5]}${pgns[6]}`;

    const positions = [];

    [firstChapter, secondChapter, thirdChapter].forEach((chapter) => {
      const moments = flat(chapter);
      const filteredMoments = moments.filter((m) => {
        // TODO: Augment with previous position
        if (m.comment === undefined) {
          return false;
        }
        return m.comment.includes("*KEY*");
      });
      positions.push(filteredMoments);
    });
    console.log(positions);
    console.log("done");
  });
});
