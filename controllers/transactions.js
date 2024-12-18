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

const createTransfer = async (req, res) => {
  try {
    if (!req.body.from_to || !req.body.description || !req.body.amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transaction = {
      description: req.body.description,
      amount: req.body.amount,
      from_to: req.body.from_to,
      user_id: req.user.id,
    };

    const createdTransfer = await transactionService.createTransfer(
      transaction
    );

    res.status(201).json({ data: createdTransfer });
  } catch (error) {
    console.log(error);

    if (
      error.message === "User not found" ||
      error.message === "Insufficient balance"
    ) {
      return res.status(400).json({ error: error.message });
    }
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const createTopup = async (req, res) => {
//   try {
//     if (!req.body.description || !req.body.amount || !req.body.user_id) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const transaction = await transactionService.createTopup(req.body);
//     res.status(201).json({ data: transaction });
//     // res.status(201).json({ data: transaction });
//   } catch (error) {
//     console.log(error.message);
//     if (
//       error.message === "User not found" ||
//       error.message === "Insufficient balance"
//     ) {
//       return res.status(400).json({ error: error.message });
//     }

//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const createTopup = async (req, res) => {
  try {
    // Memastikan semua field yang diperlukan ada
    if (!req.body.description || !req.body.amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transaction = {
      description: req.body.description,
      amount: req.body.amount,
      user_id: req.user.id, // Mendapatkan user_id dari token
    };

    // Memanggil service untuk membuat topup
    const createdTopup = await transactionService.createTopup(transaction);
    res.status(201).json({ data: createdTopup });
  } catch (error) {
    console.log(error.message);
    if (
      error.message === "User not found" ||
      error.message === "Insufficient balance"
    ) {
      return res.status(400).json({ error: error.message });
    }

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

module.exports = { createTransfer, createTopup, getTransByToken };
