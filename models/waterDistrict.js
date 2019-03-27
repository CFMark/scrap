const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocalContaminantSchema = new Schema({
    contam_name: {
        type: String
    },
    local_level: {
        type: String
    },
    state_avg: {
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

const WaterDistrictSchema = new Schema({
    sys_id: {
        type: String,
        required: true,
    },
    name: {
        type: String
    },
    city: {
        type: String
    },
    population: {
        type: Number
    },
    local_contaminants: {
        type:[LocalContaminantSchema]
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

const WaterDistrict = mongoose.model("WaterDistrict", WaterDistrictSchema);

module.exports = WaterDistrict;