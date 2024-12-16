const pool = require("../db/db");

const findUserByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM users where email = $1", [
      email,
    ]);
    return result;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

const createUser = async (user) => {
  const { email, name, password, account_number, balance, no_hp, avatar_url } =
    user;

  try {
    const result = await pool.query(
      "INSERT INTO users (email, name, password, account_number, balance, no_hp, avatar_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [email, name, password, account_number, balance, no_hp, avatar_url]
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw new Error("Database error occurred while creating the user.");
  }
};

const getUser = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM users where id = $1", [id]);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong in db");
  }
};

const getUsers = async () => {
  try {
    const result = await pool.query("SELECT * FROM users");
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong in db");
  }
};

module.exports = { createUser, findUserByEmail, getUser, getUsers };
