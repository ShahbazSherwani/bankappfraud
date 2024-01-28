const jwt = require("jsonwebtoken");

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
  res.clearCookie("token");
  res.render("customer/logout.ejs");
};

const getCustomer = function (req, res, next) {
  const query = "SELECT * from customers WHERE id=?";
  const customerID = req.customer["id"];
  const values = [customerID];

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

const getCallback = function (req, res, next) {
  const customerID = req.customer["id"];
  const slots = [];
  const daysString = ["SUN", "MON", "TUES", "WEDS", "THURS", "FRI", "SAT"];
  const times = [
    "10:00:00",
    "12:00:00",
    "14:00:00",
    "16:00:00",
    "18:00:00",
    "20:00:00",
  ];
  for (let i = 1; i < 8; i++) {
    const dayOfWeek = new Date(Date.now() + i * 24 * 60 * 60 * 1000);

    const day = daysString[dayOfWeek.getDay()];
    const date =
      dayOfWeek.getDate() < 10
        ? `0${dayOfWeek.getDate()}`
        : `${dayOfWeek.getDate()}`;
    const month =
      dayOfWeek.getMonth() + 1 < 10
        ? `0${dayOfWeek.getMonth() + 1}`
        : `${dayOfWeek.getMonth() + 1}`;
    const year = `${dayOfWeek.getFullYear()}`;

    const fullDate = `${day} ${date}/${month}/${year}`;

    const timestamps = [];
    for (let j = 0; j < times.length; j++) {
      timestamps.push(`${year}-${month}-${date} ${times[j]}`);
    }
    slots.push({ fullDate, times, timestamps });
  }

  //compare offered slots with future booked slots only, not past booked slots
  const query = "SELECT call_from from callbacks where call_from >= ?";
  const earliestSlotOffered = slots[0]["timestamps"][0];
  const values = [earliestSlotOffered];

  global.db.all(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const callbacks = rows; //callback variable to filter only available slots
      //TRIPLE FOR LOOP!!!
      for (let i = 0; i < slots.length; i++) {
        for (let j = 0; j < slots[i]["timestamps"].length; j++) {
          for (let k = 0; k < callbacks.length; k++) {
            //if callback already booked, delete from slots
            if (slots[i]["timestamps"][j] === callbacks[k]["call_from"]) {
              slots[i]["timestamps"].splice(j, 1);
              j--;
            }
          }
        }
      }
      res.render("customer/schedulecallback.ejs", {
        customerID: customerID,
        slots: slots,
      });
    }
  });
};

const postCallback = function (req, res, next) {
  const customerID = req.customer["id"];
  const slot = req.body.time;
  const query =
    "INSERT INTO callbacks ('customer_id', 'created_at', 'call_from') VALUES (?, CURRENT_TIMESTAMP, ?)";
  const values = [customerID, slot];

  global.db.all(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      //no EJS page created yet!!
      res.send(`customer ${customerID} booked slot at ${slot}`);
    }
  });
};

const getFraudReport = function (req, res, next) {
  const query = "SELECT * from customers WHERE id=?";
  const values = [req.customer["id"]];

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
  const customerID = req.customer["id"];
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

const getValidate = function (req, res) {
  const query = "SELECT * from active_calls WHERE customer_id = ? LIMIT 1";
  const values = [req.customer["id"]];
  global.db.all(query, values, function (err, rows) {
    if (err) {
      next(err);
    } else {
      const active_call = rows[0];
      res.render("customer/validateagent.ejs", {
        active_call: active_call,
      });
    }
  });
};

module.exports = {
  getCustomerLogin,
  postCustomerLogin,
  getCustomerLogout,
  getCustomer,
  getCallback,
  postCallback,
  getFraudReport,
  postFraudReport,
  getValidate,
};
