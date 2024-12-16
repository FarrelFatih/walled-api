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

const createTransaction = async (transaction) => {
  const { type, from_to, description, amount, user_id } = transaction;

  const client = await pool.connect(); // Start a transaction

  try {
    await client.query("BEGIN"); // Start the transaction block

    // Check if the current user has enough balance before proceeding
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

    // Update the balance for the 'from_to' user (add amount)
    await client.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2",
      [amount, from_to]
    );

    // Update the balance for the current user (subtract amount)
    await client.query(
      "UPDATE users SET balance = balance - $1 WHERE id = $2",
      [amount, user_id]
    );

    // Insert the new transaction record
    const result = await client.query(
      "INSERT INTO transactions (type, from_to, description, amount, user_id, date_time) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
      [type, from_to, description, amount, user_id]
    );

    await client.query("COMMIT"); // Commit the transaction block
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback if something goes wrong
    console.error("Error in createTransaction:", error);
    throw new Error("Database error occurred while creating the transaction.");
  } finally {
    client.release(); // Release the client back to the pool
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
  createTransaction,
  getTransactionByUser,
};
