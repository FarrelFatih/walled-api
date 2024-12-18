const express = require("express");
const router = express.Router();

const transController = require("../controllers/transactions");
const { authenticateToken } = require("../middlewares/auth");

router.post("/transfer", authenticateToken, transController.createTransfer);
router.post("/topup", authenticateToken, transController.createTopup);
router.get("/transactions", authenticateToken, transController.getTransByToken);

module.exports = router;
