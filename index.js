const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const teams = require("./teams.json");
const player = require("./models/playerModel");
const connectToDb = require("./connection");
const cors = require("cors");
require("dotenv").config();

app.use(express.urlencoded({extended : false}))
app.use(express.json());
app.use(cors());

connectToDb(process.env.MONGODB_URI)
  .then(() => console.log("Database connection successful"))
  .catch((err) =>
    console.log("Error ocurred while connecting to the database")
  );

app.post("/",async (req, res) => {
  const {name,number,mohallaName,role} = req.body;
  const playerId = await player.create({
        name,
        number,
        mohallaName,
        role
  })
   res.send('Player added successfully');
});

app.get("/", (req, res) => {
  res.json(teams);
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
