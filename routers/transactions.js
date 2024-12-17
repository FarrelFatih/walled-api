const express = require("express");
const router = express.Router();

const transController = require("../controllers/transactions");
const { authenticateToken } = require("../middlewares/auth");

router.post("/transfer", transController.createTransfer);
router.post("/topup", transController.createTopup);
router.get("/transactions", authenticateToken, transController.getTransByToken);

module.exports = router;
