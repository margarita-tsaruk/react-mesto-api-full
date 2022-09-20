class ErrorExistingUser extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ErrorExistingUser;
