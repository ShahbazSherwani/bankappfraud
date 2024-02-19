const express = require("express");
const mysql = require ("mysql");
const app = express();
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public")); //static files
app.use(cors()); //GLOBALLY TO BE AMENDED TO JUST SPECIFIC ROUTE

app.set("view engine", "ejs"); //template engine
app.engine("html", require("ejs").renderFile);
const PORT = process.env.PORT;

//routes
const agentRoutes = require("./routes/agent.routes");
const customerRoutes = require("./routes/customer.routes");

//connect database
const db = mysql.createConnection ({
  host: "localhost",
  user: 'root',
  password: 'password',
  database: "securecomms"
 });
 // connect to database
 db.connect((err) => {
  if (err) {
  throw err;
  }
  console.log("Connected to database");
 });

 global.db = db;

app.get("/", (req, res) => {
  res.render("index.html");
});

app.use("/agent", agentRoutes);
app.use("/customer", customerRoutes);

app.set('port',  3000);

app.use((req, res, next) => {
  return res.status(400).send("URL not found");
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
