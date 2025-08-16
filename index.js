const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const connectToDb = require("./connection");
const router = require("./routes/routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();


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

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
