const express = require("express");
const router = express.Router();
const teams = require("../teams.json");

const { handlePlayerRegistration, handleUsersignup, handleUserLogin, handleUserLogOut } = require("../controllers/user");
const { authHandler } = require("../service/auth");

router.get("/", (req, res) => {
  res.status(200).json(teams);
});

router.post("/", handlePlayerRegistration);
router.post("/signup", handleUsersignup);
router.post("/login", handleUserLogin);
router.get("/logout", handleUserLogOut);
router.get("/auth/check", authHandler);

module.exports = router;
