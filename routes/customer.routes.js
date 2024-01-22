const express = require("express");
const router = express.Router();
const {
  allCustomers,
  singleCustomer,
} = require("../controllers/customer.controllers");

router.get("/", allCustomers);
router.get("/:id", singleCustomer);

module.exports = router;
