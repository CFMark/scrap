const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WaterDistrictSchema = new Schema({
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

const WaterDistrict = mongoose.model("WaterDistrict", WaterDistrictSchema);

module.exports = WaterDistrict;