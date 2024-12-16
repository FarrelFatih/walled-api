const express = require("express");
const router = express.Router();

const transController = require("../controllers/transactions");
const { authenticateToken } = require("../middlewares/auth");

router.post("/transactions", transController.createTransaction);
router.get("/transactions", authenticateToken, transController.getTransByToken);


module.exports = router;