require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./routers/users");
const transRouter = require("./routers/transactions");
const cors = require("cors");

const app = express();
const port = process.env.APP_PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("✅ Walled API is running successfully!");
});

app.use(userRouter);
app.use(transRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
