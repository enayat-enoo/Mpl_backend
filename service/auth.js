const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
async function authHandler(req, res) {
  const token = req.cookies?.token;
  if (!token) return  res.json({ login: false });
  try {
    const result = jwt.verify(token, secretKey)
    return res.json({ login: true, username : result.name });
  } catch (err) {
    return res.json({ login: false });
  }
}

module.exports = { authHandler };
