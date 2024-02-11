const express = require("express");
const router = express.Router();
const cookieJwtAuth = require("../middlewares/customer.cookieJwtAuth");

const {
  getCustomerLogin,
  postCustomerLogin,
  getCustomerLogout,
  getCustomer,
  getCallback,
  deleteExistingSlot,
  postCallback,
  postCancelCallback,
  getFraudReport,
  postFraudReport,
  getValidate,
} = require("../controllers/customer.controllers");

router.get("/user-login", getCustomerLogin);
router.post("/login", postCustomerLogin);
router.get("/logout", getCustomerLogout);
router.get("/:id", cookieJwtAuth, getCustomer);
router.get("/:id/schedulecallback", cookieJwtAuth, getCallback);
router.post(
  "/:id/bookedcallback",
  cookieJwtAuth,
  deleteExistingSlot,
  postCallback
);
router.post(
  "/:id/appointmentcancelled",
  cookieJwtAuth,
  deleteExistingSlot,
  postCancelCallback
);
router.get("/:id/fraud-report", cookieJwtAuth, getFraudReport);
router.post("/:id/fraud-report", cookieJwtAuth, postFraudReport);
router.get("/:id/validate", cookieJwtAuth, getValidate);

module.exports = router;