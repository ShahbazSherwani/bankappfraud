const express = require("express");
const router = express.Router();

const {
  getAgents,
  getAgentLogin,
  postAgentLogin,
  getAgent,
} = require("../controllers/agent.controllers");

router.get("/all", getAgents);
router.get("/login", getAgentLogin);
router.post("/login", postAgentLogin);
router.get("/:id", getAgent);

module.exports = router;
