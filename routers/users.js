const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");
const { authenticateToken } = require("../middlewares/auth");

router.post("/users", userController.createUser);
router.get("/users/:id", userController.getUserById);
router.get("/users", userController.getUsers);
router.post("/auth/login", userController.login);
router.get("/profile", authenticateToken, userController.getUserByToken);

module.exports = router;
