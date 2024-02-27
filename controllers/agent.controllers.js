const jwt = require("jsonwebtoken");

const getAgentLogin = function (req, res, next) {
  res.render("agent/agentlogin.html");
};

const postAgentLogin = function (req, res, next) {
  const query = "SELECT id FROM agents WHERE username=? AND password=?";
  const { username, password } = req.body;
  const values = [username, password];
  db.query(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else if (rows.length === 0) {
      return res
        .status(403)
        //.send("You do not have permission to access this resource");
        .render("agent/invalidlogin.html")
    } else {
      const agent = rows[0];
      
      const token = jwt.sign({agent}, process.env.SECRET_AGENT_KEY, {
      expiresIn: "1h",
      });
       res.cookie("token", token, {
        httpOnly: true,
      });

      res.redirect(`/agent/${"id"}`);
    }
  });
};

const getAgentLogout = function (req, res, next) {
  res.clearCookie("token");
  res.render("agent/logout.ejs");
  //res.send("agent is now logged out");
};

const getAgent = function (req, res, next) {
  const query = "SELECT * FROM agents WHERE id=?";
  const agentID = req.agent.agent.id;
  const values = [agentID];

  db.query(query, values, function (err, rows) {
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

//SQL Middleware to create active call
const createActiveCallAndToken = function (req, res, next) {
  let values = [];

  const agentID = req.agent.agent.id;
  const { customer_id } = req.body;
  //generate random number of 4 digits - temp function  to be replaced by encrypted function
  const randomToken = String(Math.random().toString().substring(2, 6));

  if (req.body.hasOwnProperty("callback_id")) {
    const callback_id = req.body.callback_id;
    values = [customer_id, agentID, callback_id, randomToken];
  } else {
    values = [customer_id, agentID, randomToken];
  }

  const query =
    values.length === 3
      ? "INSERT INTO active_calls (customer_id, agent_id, validation_token) VALUES (?,?,?)"
      : "INSERT INTO active_calls (customer_id, agent_id, callback_id, validation_token) VALUES (?,?,?,?)";

  db.query(query, values, function (err, rows) {
    if (err) {
      next(err);
    }
  });
  next();
};

const getCustomers = function (req, res, next) {
  const query = "SELECT username, id as customerID FROM customers";
  const agentID = req.agent.agent.id;

  db.query(query, function (err, rows) {
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

//postCustomer and postCustomerCallback can be merged as one function
const postCustomer = function (req, res, next) {
  const { customer_id } = req.body;
  const agentID = req.agent.agent.id;
  const query =
    "SELECT * FROM active_calls WHERE customer_id = ? ORDER BY created_at DESC LIMIT 1";
  const values = [customer_id];
  db.query(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const activeCall = rows[0];
      res.render("agent/agenthome.html", {
        agentID: agentID,
        customer_id: customer_id,
        randomToken: activeCall["validation_token"],
        activeCallID: activeCall["id"],
      });
    }
  });
};

const getCustomersCallbacks = function (req, res, next) {
  const query =
    "SELECT customers.username, customers.id as customerID, callbacks.call_from, callbacks.id as callbackID FROM customers JOIN callbacks ON customers.id = callbacks.customer_id WHERE callbacks.id NOT IN (SELECT active_calls.callback_id FROM active_calls) ORDER BY customers.id, callbacks.call_from";
  const agentID = req.agent.agent.id;

  db.query(query, function (err, rows) {
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

const postCustomerCallback = function (req, res, next) {
  const { customer_id } = req.body;
  const agentID = req.agent.agent.id;
  const query =
    "SELECT * FROM active_calls WHERE customer_id = ? ORDER BY created_at DESC LIMIT 1";
  const values = [customer_id];
  db.query(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const activeCall = rows[0];
      res.render("agent/agenthome.html", {
        agentID: agentID,
        customer_id: customer_id,
        randomToken: activeCall["validation_token"],
        activeCallID: activeCall["id"],
      });
    }
  });
};

const postValidated = function (req, res, next) {
  const { agent_entered_token_input, random_token, active_call_id } = req.body;

  if (String(agent_entered_token_input) !== String(random_token)) {
     return res.render("agent/notvalidated.html")
    //return res.send("validation failed");
   
  }

  const query =
    "UPDATE active_calls SET is_validated = 1, validated_at = CURRENT_TIMESTAMP WHERE id = ?";
  const values = [active_call_id];

  db.query(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      res.render("agent/validated.html")
      //res.send("Successful validation");
    }
  });
};

module.exports = {
  getAgentLogin,
  postAgentLogin,
  getAgentLogout,
  getAgent,
  createActiveCallAndToken,
  getCustomers,
  postCustomer,
  getCustomersCallbacks,
  postCustomerCallback,
  postValidated,
};
