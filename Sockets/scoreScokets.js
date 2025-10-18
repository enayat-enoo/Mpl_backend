const scoreModel = require("../models/score");

module.exports = function (io) {
  io.on("connection", async (socket) => {
    socket.on("joinMatch", async ({ matchId }) => {
      socket.join(matchId);
      const currentScore = await scoreModel.findOne({ matchDetails: matchId });
      const liveScore = {
        runs: currentScore.runs,
        wickets: currentScore.wickets,
        overs: currentScore.Overs,
        balls: currentScore.balls,
      };
      socket.emit("liveScore", liveScore);
    });

    socket.on("score", async ({ matchId, data }) => {
      let prevScores = await scoreModel.findOne({ matchDetails: matchId });
      const score = data;
      const updateRuns = prevScores.runs + score;
      if (data.wickets) prevScores.wickets += 1;
      let updateBalls = prevScores.balls + 1;

      if (updateBalls === 6) {
        prevScores.Overs += 1;
        updateBalls = 0;
      }
      prevScores.runs = updateRuns;
      prevScores.balls = updateBalls;
      await prevScores.save();
      const updatedScore = {
        runs: prevScores.runs,
        wickets: prevScores.wickets,
        overs: prevScores.Overs,
        balls: prevScores.balls,
      };
       io.to(matchId).emit("liveScore", updatedScore);
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
