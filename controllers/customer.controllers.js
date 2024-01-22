const jwt = require("jsonwebtoken");

const allCustomers = function (req, res) {
  const query = "SELECT * from customers";

  global.db.all(query, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const customers = rows;
      res.render("customer/home.ejs", {
        customers: customers,
      });
    }
  });
};

const getCustomerLogin = function (req, res) {
  res.render("customer/login.ejs");
};

const postCustomerLogin = function (req, res) {
  const query = "SELECT id from customers WHERE username=? AND password=?";
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
      const customer = rows[0];
      const token = jwt.sign(customer, process.env.SECRET_CUSTOMER_KEY, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
      });

      res.redirect(`/customer/${customer["id"]}`);
    }
  });
};

const getCustomerLogout = function (req, res) {
  res.render("customer/logout.ejs");
};

const getCustomer = function (req, res, next) {
  const query = "SELECT * from customers WHERE id=?";
  const values = [req.params.id];

  global.db.all(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const customer = rows[0];
      res.render("customer/customer.ejs", {
        customer: customer,
      });
    }
  });
};

const getFraudReport = function (req, res, next) {
  const query = "SELECT * from customers WHERE id=?";
  const values = [req.params.id];

  global.db.all(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const customer = rows[0];
      res.render("customer/reportfraud.ejs", {
        customer: customer,
      });
    }
  });
};

const postFraudReport = function (req, res, next) {
  const query =
    "INSERT INTO fraud_reports ('customer_id', 'fraud_time', 'fraud_tel', 'fraud_description') VALUES (?,?,?,?)";
  const customerID = req.params.id;
  const fraudTime = req.body.fraud_time;
  const fraudTel = req.body.fraud_tel;
  const fraudDescription = req.body.fraud_description;
  const values = [customerID, fraudTime, fraudTel, fraudDescription];

  global.db.all(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      res.redirect(`/customer/${req.params.id}`);
    }
  });
};

module.exports = {
  allCustomers,
  getCustomerLogin,
  postCustomerLogin,
  getCustomerLogout,
  getCustomer,
  getFraudReport,
  postFraudReport,
};
