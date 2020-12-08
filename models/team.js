const mongoose = require("mongoose");
const collectionName = "ipl_match"

const teamScores = mongoose.Schema({
    team_name: { type: String, required: false, unique: true },
    wins: { type: Number, required: false },
    losses: { type: Number, required: false },
    ties: { type: Number, required: false },
    score: { type: Number, required: false },
}, { versionKey: false });

const PageInfo = mongoose.model(collectionName, teamScores);
module.exports = PageInfo;