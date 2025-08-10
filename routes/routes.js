const express=require('express')
const router = express.Router();
const teams = require("../teams.json");
const player = require("../models/playerModel");

router.get("/", (req, res) => {
  res.json(teams);
});

router.post("/",async (req, res) => {
  const {name,number,mohallaName,role} = req.body;
  const playerId = await player.create({
        name,
        number,
        mohallaName,
        role
  })
   res.send('Player added successfully');
});

module.exports = router