const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const connectToDb = require("./connection");
const router = require('./routes/routes')
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

  app.use('/',router);

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
