const express = require("express");
const router = express.Router();
const cookieJwtAuth = require("../middlewares/customer.cookieJwtAuth");

const {
  allCustomers,
  getCustomerLogin,
  postCustomerLogin,
  getCustomerLogout,
  getCustomer,
  getFraudReport,
  postFraudReport,
} = require("../controllers/customer.controllers");

router.get("/", allCustomers);
router.get("/login", getCustomerLogin);
router.post("/login", postCustomerLogin);
router.get("/logout", getCustomerLogout);
router.get("/:id", cookieJwtAuth, getCustomer);
router.get("/:id/fraud-report", cookieJwtAuth, getFraudReport);
router.post("/:id/fraud-report", cookieJwtAuth, postFraudReport);

module.exports = router;