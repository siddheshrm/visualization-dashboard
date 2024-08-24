const express = require("express");
const mongoose = require("mongoose");
const DataModel = require("./model");
require("./config");

const app = express();
const port = 3000;

// Middleware to serve static files (Bootstrap CSS, JS)
app.use(express.static("public"));
app.use(express.json());

// Route to serve the homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// API route to get data from MongoDB with optional filtering
app.get("/filters", async (req, res) => {
  try {
    const filters = {};
    filters.startYear = await DataModel.distinct("start_year");
    filters.endYear = await DataModel.distinct("end_year");
    filters.topics = await DataModel.distinct("topic");
    filters.sector = await DataModel.distinct("sector");
    filters.region = await DataModel.distinct("region");
    filters.country = await DataModel.distinct("country");
    filters.intensity = await DataModel.distinct("intensity");
    filters.likelihood = await DataModel.distinct("likelihood");
    filters.relevance = await DataModel.distinct("relevance");

    res.json(filters);
  } catch {
    alert("Error fetching filter options");
    res.status(500).send("Error fetching filter options");
  }
});

// API route to get distinct values for filter options
app.get("/data", async (req, res) => {
  try {
    const { startYear, endYear, topics, region, country } = req.query;

    let matchStage = {};

    if (startYear && endYear) {
      matchStage.start_year = { $gte: parseInt(startYear, 10) };
      matchStage.end_year = { $lte: parseInt(endYear, 10) };
    } else if (startYear) {
      matchStage.start_year = { $gte: parseInt(startYear, 10) };
    } else if (endYear) {
      matchStage.end_year = { $lte: parseInt(endYear, 10) };
    }

    if (topics) matchStage.topic = topics;
    if (region) matchStage.region = region;
    if (country) matchStage.country = country;

    const data = await DataModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$topic",
          averageIntensity: { $avg: "$intensity" },
        },
      },
      {
        $project: {
          _id: 0,
          sector: "$_id",
          averageIntensity: 1,
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    console.error("Error fetching data from MongoDB:", err);
    res.status(500).send("Error fetching data from MongoDB");
  }
});

// API route to get countries by region
app.get("/countries", async (req, res) => {
  try {
    const { region } = req.query;
    if (!region) {
      return res.status(400).send("Region is required");
    }

    const countries = await DataModel.distinct("country", { region });
    res.json(countries);
  } catch {
    alert("Error fetching countries by region");
    res.status(500).send("Error fetching countries by region");
  }
});

// API route to get year-wise data for line chart
app.get("/line-data", async (req, res) => {
  try {
    const { startYear, endYear, topics, region, country, metric } = req.query;

    let matchStage = {};

    if (startYear && endYear) {
      matchStage.start_year = { $gte: parseInt(startYear, 10) };
      matchStage.end_year = { $lte: parseInt(endYear, 10) };
    } else if (startYear) {
      matchStage.start_year = { $gte: parseInt(startYear, 10) };
    } else if (endYear) {
      matchStage.end_year = { $lte: parseInt(endYear, 10) };
    }

    if (topics) matchStage.topic = topics;
    if (region) matchStage.region = region;
    if (country) matchStage.country = country;

    const groupField =
      metric === "intensity"
        ? "intensity"
        : metric === "likelihood"
        ? "likelihood"
        : "relevance";

    const data = await DataModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$start_year",
          averageValue: { $avg: `$${groupField}` },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id",
          averageValue: 1,
        },
      },
      { $sort: { year: 1 } }, // Sort by year
    ]);

    res.json(data);
  } catch (err) {
    console.error("Error fetching data for line chart:", err);
    res.status(500).send("Error fetching data for line chart");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
