const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const port = process.env.PORT || 8000;
const connectToDb = require("./connection");
const router = require("./routes/routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const scoreModel = require("./models/score");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, // React frontend
    methods: ["GET", "POST"],
  },
});

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

//Database Connection
connectToDb(process.env.MONGODB_URI)
  .then(() => console.log("Database connection successful"))
  .catch((err) => {
    console.log("DB connection failed", err);
    process.exit(1);
  });

//Global Error handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ error: err.message });
});

app.use("/", router);

//Score Update

io.on("connection", async (socket) => {
  console.log("a user connected");
  const current = await scoreModel.findOne({});
  if (current) {
    socket.emit("score", {runs:current.runs,wickets:current.wickets,overs:current.Overs,balls:current.balls});
  }
  socket.on("score", async (score) => {
    console.log("score : ", score);
    const prevScores = await scoreModel.findOne({});
    if(!prevScores){
        await scoreModel.create({runs : score.runs,wickets: score.wicket, Overs : score.over,balls : score.balls});
    }
    const totalScore = (prevScores?.runs || 0) + score.runs;
    await scoreModel.findOneAndUpdate({}, { runs: totalScore, wickets : score.wicket, Overs : score.over , balls : score.balls });
    socket.broadcast.emit("score", {runs:totalScore,wickets:score.wicket,overs:score.over,balls:score.balls});
  });
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
