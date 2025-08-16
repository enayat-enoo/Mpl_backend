const player = require("../models/playerModel");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const saltRounds = parseInt(process.env.SALT_ROUNDS,10);
const secretKey = process.env.SECRET_KEY;
async function handlePlayerRegistration(req, res) {
  const { name, number, mohallaName, role } = req.body;
  if(!name || !number || !mohallaName || !role){
    return res.status(400).json({message : false });
  }
  try {
    const playerId = await player.create({
      name,
      number,
      mohallaName,
      role,
    });
    if(!playerId) return res.status(500).json({message : false})
    return res.status(200).json({ message: true });
  } catch (error) {
    return res.status(400).json({ message: false });
  }
}

async function handleUsersignup(req, res) {
  const { name, email, username, password } = req.body;
  if(!name || !email || !username || !password){
    return res.status(400).json({signup : false})
  }
  try {
    const hashPassword = await bcrypt.hash(password, saltRounds);
    await userModel.create({
      name: name,
      email: email,
      username: username,
      password: hashPassword,
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
    if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, 
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      }).status(201)
      .json({ login: true ,user : user.name});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

async function handleUserLogOut(req, res) {
  res.clearCookie("token",{
    httpOnly: true,
    secure: true, 
    sameSite: "none",
  });
  return res.status(200).json({ logout: true });
}

module.exports = {
  handlePlayerRegistration,
  handleUsersignup,
  handleUserLogin,
  handleUserLogOut,
};
