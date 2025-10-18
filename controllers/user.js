const player = require("../models/playerModel");
const match = require("../models/matchModel");
const userModel = require("../models/user");
const scoreModel = require("../models/score")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
const secretKey = process.env.SECRET_KEY;
async function handlePlayerRegistration(req, res) {
  const { name, number, mohallaName, role } = req.body;
  if (!name || !number || !mohallaName || !role) {
    return res.status(400).json({ missingRequiredFields: true });
  }
  try {
    const playerId = await player.create({
      name,
      number,
      mohallaName,
      role,
    });
    if (!playerId) return res.status(500).json({ databaseError: true });
    return res.status(200).json({ registration: true });
  } catch (error) {
    return res.status(400).json({ message: "Some error has occurred" });
  }
}

async function handleUsersignup(req, res) {
  const { name, email, username, password } = req.body;
  if (!name || !email || !username || !password) {
    return res.status(400).json({ signup: false });
  }
  const userNameFind = await userModel.findOne({ username });
  if (userNameFind)
    res
      .status(400)
      .json({ message: "Username already exist's", userName: true });
  try {
    const hashPassword = await bcrypt.hash(password, saltRounds);
    await userModel.create({
      name: name,
      email: email,
      username: username,
      password: hashPassword,
      role: req.body.role || "user", //Admin can only be set directly through database
    });
    res.status(200).json({ signup: true });
  } catch (error) {
    res.status(400).json({ signup: false, message: "An error occurred" });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "No user found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ incorrectPassword: "Incorrect password" });

    const payload = {
      id: user._id,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        // secure: false, //To be used in localhost only
        sameSite: "none",
        // sameSite: "lax", //To be used in localhost only
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ login: true, user: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ serverError: "Server error" });
  }
}

async function handleUserLogOut(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    // secure: false, //To be used in localhost only
    sameSite: "none",
    // sameSite: "lax", //To be used in localhost only
  });
  return res.status(200).json({ logout: true });
}

async function createMatch(req, res) {
  const userData = req.user;
  const { team1, team2, date } = req.body;
  if (!team1 || !team2) {
    return res.status(401).json({ missingRequiredFields: "true" });
  }
  try {
    const matchData = await match.create({
      firstTeam: team1,
      secondTeam: team2,
      date: date,
      createdBy : userData.id
    });

    const scoreDb=await scoreModel.create({
      runs : 0,
      wickets : 0,
      Overs : 0,
      balls : 0,
      matchDetails : matchData._id
    })
    res.status(200).json({ status: true ,message : "match created",scoreDb : scoreDb._id});
  } catch (error) {
    console.log(error)
    res.status(400).json({ status : false, message: "Some error has occurred" });
  }
}

async function getMatchDetailsByUserId(req,res) {
    const userId = req.user.id;
    try {
      const matchData = await match.find({createdBy : userId});
      return res.status(200).json(matchData)
    } catch (error) {
      return res.json({message : "some error has occured"})
    }
}

async function getMatchDetails(req,res){
    const matchData = await match.find({})
    return res.status(200).json({matchData})
}

module.exports = {
  handlePlayerRegistration,
  handleUsersignup,
  handleUserLogin,
  handleUserLogOut,
  createMatch,
  getMatchDetails,
  getMatchDetailsByUserId
};
