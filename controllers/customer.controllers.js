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

const singleCustomer = function (req, res, next) {
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

module.exports = { allCustomers, singleCustomer };
