const express = require("express");
const router = express.Router();
const teams = require("../teams.json");
const {isAuthMiddleware, isAdminMiddleware} = require('../middlewares/auth')

const { handlePlayerRegistration, handleUsersignup, handleUserLogin, handleUserLogOut,createMatch, getMatchDetails,getMatchDetailsByUserId } = require("../controllers/user");
const { authHandler } = require("../service/auth");

router.get("/", (req, res) => {
  res.status(200).json(teams);
});

router.post("/",handlePlayerRegistration);
router.post("/signup", handleUsersignup);
router.post("/login", handleUserLogin);
router.post("/creatematch",isAuthMiddleware,isAdminMiddleware,createMatch);
router.get('/matchdetails',getMatchDetails);
router.get("/logout", handleUserLogOut);
router.get("/auth/check", isAuthMiddleware,isAdminMiddleware, authHandler);
router.get("/getmatches",isAuthMiddleware,isAdminMiddleware,getMatchDetailsByUserId);

module.exports = router;
