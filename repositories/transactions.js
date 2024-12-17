const pool = require("../db/db");

const getTransactionByUser = async (user_id) => {
  try {
    console.log("Fetching transactions for user_id:", user_id);
    const result = await pool.query(
      "SELECT * FROM transactions where user_id = $1",
      [user_id]
    );
    return result;
  } catch (error) {
    throw new Error("Something went wrong (findTransactionByUser)");
  }
};

const createTransfer = async (transaction) => {
  const { type, from_to, description, amount, user_id } = transaction;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userBalanceResult = await client.query(
      "SELECT balance FROM users WHERE id = $1",
      [user_id]
    );

    if (userBalanceResult.rows.length === 0) {
      throw new Error("User not found");
    }

    const userBalance = userBalanceResult.rows[0].balance;
    if (userBalance < amount) {
      throw new Error("Insufficient balance");
    }

    await client.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2",
      [amount, from_to]
    );

    await client.query(
      "UPDATE users SET balance = balance - $1 WHERE id = $2",
      [amount, user_id]
    );

    const result = await client.query(
      "INSERT INTO transactions (type, from_to, description, amount, user_id, date_time) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
      [type, from_to, description, amount, user_id]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in createTransaction:", error);
    throw new Error("Database error occurred while creating the transaction.");
  } finally {
    client.release();
  }
};

const createTopup = async (transaction) => {
  const { description, amount, user_id } = transaction;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userBalanceResult = await client.query(
      "SELECT balance FROM users WHERE id = $1",
      [user_id]
    );

    if (userBalanceResult.rows.length === 0) {
      throw new Error("User not found");
    }

    await client.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2",
      [amount, user_id]
    );

    const result = await client.query(
      "INSERT INTO transactions (type, from_to, description, amount, user_id, date_time ) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
      ["TOPUP", user_id, description, amount, user_id]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    console.log(error.message);
    await client.query("ROLLBACK");
    console.error("Error in topup:", error);
    throw new Error("Database error occurred while topping up the balance.");
  } finally {
    client.release();
  }
};

// const createTransaction = async (transaction) => {
//   try {
//     const { type, from_to, description, amount, user_id } = transaction;
//     await pool.query(
//       "UPDATE users SET balance = balance + $1 WHERE id = $2",
//       [amount, user_id],
//       (error) => {
//         if (error) {
//           throw error;
//         }
//       }
//     );
//     const result = await pool.query(
//       "INSERT INTO transactions (type, from_to, description, amount, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//       [type, from_to, description, amount, user_id]
//     );
//     return result.rows[0];
//   } catch (error) {
//     throw new Error("Database error occurred while creating the transaction.");
//   }
// };

module.exports = {
  createTransfer,
  getTransactionByUser,
  createTopup,
};
