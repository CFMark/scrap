const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContaminantSchema = new Schema({
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

const Contaminant = mongoose.model("Contaminant", ContaminantSchema);

module.exports = Contaminant;