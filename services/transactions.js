const transactionRepository = require("../repositories/transactions");

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

const createTransfer = async (transaction) => {
  try {
    const createdTransfer = await transactionRepository.createTransfer(
      transaction
    );
    return createdTransfer;
  } catch (error) {
    console.error("Error in createTransaction service:", error);
    throw new Error("Service error occurred while creating the transaction.");
  }
};

const createTopup = async (transaction) => {
  try {
    const createdTopup = await transactionRepository.createTopup(transaction);
    return createdTopup;
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
  createTransfer,
  createTopup,
  getTransactionsByUser,
};
