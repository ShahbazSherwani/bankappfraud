const express = require("express");
const app = express();
const PORT = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public")); // set location of static files
app.set("view engine", "ejs");

const agentRoutes = require("./routes/agent.routes");
const customerRoutes = require("./routes/customer.routes");

const sqlite3 = require("sqlite3").verbose();
global.db = new sqlite3.Database("./database.db", function (err) {
  if (err) {
    console.error(err);
    process.exit(1); // bail out we can't connect to the DB
  } else {
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); // tell SQLite to pay attention to foreign key constraints
  }
});

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/agent", agentRoutes);
app.use("/customer", customerRoutes);

app.use((req, res, next) => {
  return res.status(400).send("URL not found");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
