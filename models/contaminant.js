const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContaminantSchema = new Schema({
    contam_id: {
        type: String
    },
    name: {
        type: String
    },
    local_level: {
        type: String
    },
    state_avg:{
        type: String
    },
    nat_avg: {
        type: String
    },
    limit_type: {
        type: String
    },
    limit_level: {
        type: String
    }
});

const Contaminant = mongoose.model("Contaminant", ContaminantSchema);

module.exports = Contaminant;