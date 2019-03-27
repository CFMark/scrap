const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const System = new Schema({
    id: {
        type: String,
        required: true,
    },
});

const ZipSchema = new Schema({
    zip_id: {
        type: String,
        required: true,
    },
    systems: {
        type:[System]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }

});

const Zip = mongoose.model("Zip", ZipSchema);

module.exports = Zip;