const transactionService = require("../services/transactions");

// const createTransaction = async (req, res) => {
//   try {
//     const transaction = await transactionService.createTransaction(req.body);
//     res.status(201).json({ data: transaction });
//   } catch (error) {
//     console.log(error);
//     if (error.message === "404") {
//       return res.status(404).json({ error: error.message });
//     }
//     res.status(error.statusCode || 500).json({ error: error.message });
//   }
// };

const createTransaction = async (req, res) => {
  try {
    // Validate input
    if (
      !req.body.type ||
      !req.body.from_to ||
      !req.body.description ||
      !req.body.amount
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Call the service to create the transaction
    const transaction = await transactionService.createTransaction(req.body);

    // Respond with the created transaction
    res.status(201).json({ data: transaction });
  } catch (error) {
    console.log(error);

    // Handle specific errors
    if (
      error.message === "User not found" ||
      error.message === "Insufficient balance"
    ) {
      return res.status(400).json({ error: error.message });
    }

    // Handle unexpected errors
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTransByToken = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "Invalid user token" });
    }

    console.log("Fetching transactions for user:", req.user.id);

    const transactions = await transactionService.getTransactionsByUser({
      idFromToken: req.user.id,
    });

    res.status(200).json({ data: transactions });
  } catch (error) {
    console.error("Error in getTransByToken:", error);

    if (error.message.includes("No transactions found")) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

module.exports = { createTransaction, getTransByToken };
