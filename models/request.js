const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    zipcode: {
        type: String
    },
    email: {
        type: String
    },
    cookie: {
        type: String
    }
});

const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;