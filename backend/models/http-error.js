class HttpError extends Error {
  constructor(message, errorCode) {
    super(); // must call super first to instantiate derived class
    this.message = message; //Add a message property
    this.code = errorCode; //Adds a "code" property
  }
}

module.exports = HttpError;
