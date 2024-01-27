const jwt = require("jsonwebtoken");

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

const getAgentLogout = function (req, res, next) {
  res.clearCookie("token");
  res.send("agent is now logged out");
};

const getAgent = function (req, res, next) {
  const query = "SELECT * from agents WHERE id=?";
  const agentID = req.agent["id"];
  const values = [agentID];

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

const getCustomers = function (req, res, next) {
  const query = "SELECT * from customers";
  const agentID = req.agent["id"];

  global.db.all(query, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const customers = rows;
      res.render("agent/customers.ejs", {
        agentID: agentID,
        customers: customers,
      });
    }
  });
};
const getCustomersCallbacks = function (req, res, next) {
  const query =
    "SELECT customers.username, callbacks.call_from FROM customers JOIN callbacks ON customers.id = callbacks.customer_id ORDER BY callbacks.call_from";
  const agentID = req.agent["id"];

  global.db.all(query, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const callbackInfo = rows;
      res.render("agent/callbacks.ejs", {
        agentID: agentID,
        callbackInfo: callbackInfo,
      });
    }
  });
};
const postCallCustomer = function (req, res, next) {
  res.send("test");
};

module.exports = {
  getAgentLogin,
  postAgentLogin,
  getAgentLogout,
  getAgent,
  getCustomers,
  getCustomersCallbacks,
  postCallCustomer,
};
