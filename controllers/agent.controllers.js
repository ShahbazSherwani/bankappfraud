const jwt = require("jsonwebtoken");

const getAgentLogin = function (req, res, next) {
  res.render("agent/agentlogin.html");
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
  res.render("agent/logout.ejs");
  //res.send("agent is now logged out");
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
  const query = "SELECT username, id as customerID from customers";
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

//postCustomer and postCustomerCallback can be merged as one function
const postCustomer = function (req, res, next) {
  const { customer_id } = req.body;
  const agentID = req.agent["id"];
  //generate random number of 4 digits - temp function, to be replaced by encrypted function
  const randomToken = Math.random().toString().substring(2, 6);
  const query =
    "INSERT INTO active_calls ('customer_id', 'agent_id','validation_token') VALUES (?,?,?)";
  const values = [customer_id, agentID, randomToken];
  global.db.all(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      res.send("token sent to customer");
    }
  });
};

const getCustomersCallbacks = function (req, res, next) {
  const query =
    "SELECT customers.username, customers.id as customerID, callbacks.call_from, callbacks.id as callbackID FROM customers JOIN callbacks ON customers.id = callbacks.customer_id ORDER BY callbacks.call_from";
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

const postCustomerCallback = function (req, res, next) {
  const { customer_id, callback_id } = req.body;
  const agentID = req.agent["id"];
  //generate random number of 4 digits - temp function  to be replaced by encrypted function
  const randomToken = Math.random().toString().substring(2, 6);
  const query =
    "INSERT INTO active_calls ('customer_id', 'agent_id', 'callback_id', 'validation_token') VALUES (?,?,?,?)";
  const values = [customer_id, agentID, callback_id, randomToken];
  global.db.all(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      console.log(rows);
      res.render("agent/agenthome.html", {
        agentID: agentID,
        customer_id: customer_id,
        randomToken: randomToken,
      });
      //res.send("token sent to customer");
    }
  });
};

////
const postValidated = function (req, res, next) {
  const { validation_token, customer_id } = req.body;

  const query =
    "SELECT validation_token from active_calls WHERE customer_id = ? ORDER BY created_at DESC LIMIT 1";

  const values = [customer_id];

  global.db.all(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      //check if "agent entered code" is equal to server-generated validation token
      if (String(validation_token) === String(rows[0]["validation_token"])) {
        console.log(
          validation_token,
          " compare with",
          String(rows[0]["validation_token"])
        );
        res.send("agent validated"); ///TO BE CHANGED
      } else {
        res.send("validation failed"); ///TO BE CHANGED
      }
    }
  });
};

module.exports = {
  getAgentLogin,
  postAgentLogin,
  getAgentLogout,
  getAgent,
  getCustomers,
  postCustomer,
  getCustomersCallbacks,
  postCustomerCallback,
  postValidated,
};
