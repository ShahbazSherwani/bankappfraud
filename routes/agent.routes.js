const express = require("express");
const router = express.Router();
const cookieJwtAuth = require("../middlewares/agent.cookieJwtAuth");

const {
  getAgents,
  getAgentLogin,
  postAgentLogin,
  getAgentLogout,
  getAgent,
  getCustomers,
  getCustomersCallbacks,
  postCallCustomer,
} = require("../controllers/agent.controllers");

router.get("/", getAgents);
router.get("/login", getAgentLogin);
router.post("/login", postAgentLogin);
router.get("/logout", getAgentLogout);
router.get("/:id", cookieJwtAuth, getAgent);
router.get("/:id/customers", cookieJwtAuth, getCustomers);
router.get("/:id/customers-callbacks", cookieJwtAuth, getCustomersCallbacks);
router.post("/:id/call-customer", cookieJwtAuth, postCallCustomer);

module.exports = router;
