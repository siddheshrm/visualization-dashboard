const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    end_year: Number,
    intensity: Number,
    sector: String,
    topic: String,
    insight: String,
    url: String,
    region: String,
    start_year: Number,
    impact: String,
    added: String,
    published: String,
    country: String,
    relevance: Number,
    pestle: String,
    source: String,
    title: String,
    likelihood: Number,
  },
  { collection: "assignment_sample_data" }
); // explicitly set the collection name

const DataModel = mongoose.model("Data", dataSchema);

module.exports = DataModel;
