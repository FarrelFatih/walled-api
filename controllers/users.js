const Joi = require("joi");
const userService = require("../services/users");
const userResponse = require("../dto/userResponse");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  account_number: Joi.number().optional(),
  balance: Joi.number().optional(),
  no_hp: Joi.string().optional(),
  avatar_url: Joi.optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createUser = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const user = await userService.createUser(value);
    res.status(201).json({ data: new userResponse(user) });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    res.status(200).json({ data: user });
  } catch (error) {
    if (error.message === "user not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const getUserByToken = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await userService.getUser(Number(id));
    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
    if (error.message === "user not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json({ data: users });
  } catch (error) {
    if (error.message === "user not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const token = await userService.login(value);
    res.status(201).json({ data: { token: token } });
  } catch (error) {
    if (error.message === "404") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === "401") {
      return res.status(401).json({ error: error.message });
    }
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

module.exports = { createUser, getUserById, getUsers, login, getUserByToken };
