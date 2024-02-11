const express = require("express");
const router = express.Router();
const cookieJwtAuth = require("../middlewares/agent.cookieJwtAuth");

const {
  getAgentLogin,
  postAgentLogin,
  getAgentLogout,
  getAgent,
  getCustomers,
  postCustomer,
  getCustomersCallbacks,
  postCustomerCallback,
  postValidated,
} = require("../controllers/agent.controllers");

router.get("/agent-login", getAgentLogin);
router.post("/Agentlogin", postAgentLogin);
router.get("/logout", getAgentLogout);
router.get("/:id", cookieJwtAuth, getAgent);
router.get("/:id/customers", cookieJwtAuth, getCustomers);
router.post("/:id/customers", cookieJwtAuth, postCustomer);
router.get("/:id/customers-callbacks", cookieJwtAuth, getCustomersCallbacks);
router.post("/:id/customers-callbacks", cookieJwtAuth, postCustomerCallback);
router.post("/:id/validated", cookieJwtAuth, postValidated);

module.exports = router;