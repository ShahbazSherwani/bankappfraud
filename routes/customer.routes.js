const express = require("express");
const router = express.Router();
const {
  allCustomers,
  singleCustomer,
  getFraudReport,
  postFraudReport,
} = require("../controllers/customer.controllers");

router.get("/", allCustomers);
router.get("/:id", singleCustomer);
router.get("/:id/fraud-report", getFraudReport);
router.post("/:id/fraud-report", postFraudReport);

module.exports = router;
