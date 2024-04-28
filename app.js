const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
require("dotenv").config();
const authRouter = require("./Routes/authRoute");

//DatabaseConnect
mongoose
  .connect(process.env.mongooseDb, {})
  .then(() => {
    console.log("Mongoose connection sucessfull!!!");
  })
  .catch((e) => {
    console.log("error occured,", e);
  });

//including routes

app.use("/", authRouter);

//Server part
app.listen(3000, () => {
  console.log("Server Started!!!");
});
