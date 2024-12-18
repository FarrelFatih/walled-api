class userResponse {
  constructor(user) {
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
  }
}

module.exports = userResponse;
