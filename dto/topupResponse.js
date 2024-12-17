class TopupResponse {
  constructor(transaction) {
    this.id = transaction.id;
    this.type = transaction.type;
    this.description = transaction.description;
    this.amount = transaction.amount;
    this.user_id = transaction.user_id;
    this.date_time = transaction.date_time;
  }
}

module.exports = TopupResponse;
