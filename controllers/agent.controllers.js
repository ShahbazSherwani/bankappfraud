const jwt = require("jsonwebtoken");

const getAgents = function (req, res) {
  const query = "SELECT * from agents";

  global.db.all(query, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const agents = rows;
      res.render("agent/home.ejs", {
        agents: agents,
      });
    }
  });
};

const getAgentLogin = function (req, res, next) {
  res.render("agent/login.ejs");
};

const postAgentLogin = function (req, res, next) {
  const query = "SELECT id from agents WHERE username=? AND password=?";
  const { username, password } = req.body;
  const values = [username, password];
  global.db.all(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else if (rows.length === 0) {
      return res
        .status(403)
        .send("You do not have permission to access this resource");
    } else {
      const agent = rows[0];
      const token = jwt.sign(agent, process.env.SECRET_AGENT_KEY, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
      });

      res.redirect(`/agent/${agent["id"]}`);
    }
  });
};

const getAgent = function (req, res, next) {
  const query = "SELECT * from agents WHERE id=?";
  const values = [req.params.id];

  global.db.all(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const agent = rows[0];
      res.render("agent/agent.ejs", {
        agent: agent,
      });
    }
  });
};

module.exports = {
  getAgents,
  getAgentLogin,
  postAgentLogin,
  getAgent,
};
