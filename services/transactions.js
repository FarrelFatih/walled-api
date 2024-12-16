const transactionRepository = require("../repositories/transactions");
const userRepository = require("../repositories/users");

// const createTransaction = async (transaction, user) => {
//   const userId = transaction.user_id;
//   if (!userId) {
//     throw new Error("User ID is required");
//   }
//   const userData = await userRepository.getUser(userId);
//   if (userData.rows.length === 0) {
//     throw new Error(404);
//   }
//   const trans = await transactionRepository.createTransaction(transaction);
//   return trans;
// };

const createTransaction = async (transaction) => {
  try {
    // Call the repository to create the transaction
    const createdTransaction = await transactionRepository.createTransaction(
      transaction
    );
    return createdTransaction;
  } catch (error) {
    console.error("Error in createTransaction service:", error);
    throw new Error("Service error occurred while creating the transaction.");
  }
};

const getTransactionsByUser = async ({ idFromToken }) => {
  console.log("Input to getTransactionsByUser:", idFromToken);

  const transactions = await transactionRepository.getTransactionByUser(
    idFromToken
  );

  console.log("Transactions fetched:", transactions.rows);

  if (!transactions || transactions.rows.length === 0) {
    throw new Error("No transactions found for this user");
  }

  return transactions.rows;
};

module.exports = {
  createTransaction,
  getTransactionsByUser,
};
