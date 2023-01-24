//Error handler to create customized messages

// Creating class that extends the build-in "Error"
class ExpressError extends Error {
    constructor(message, statusCode) {
        // This function allows the "ExpressError" class to inherit properties and methods from the parent "Error" class, as well as to set its own properties.
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;