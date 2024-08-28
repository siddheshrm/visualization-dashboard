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
    filters.topic = await DataModel.distinct("topic");
    filters.sector = await DataModel.distinct("sector");
    filters.region = await DataModel.distinct("region");
    filters.country = await DataModel.distinct("country");
    filters.intensity = await DataModel.distinct("intensity");
    filters.likelihood = await DataModel.distinct("likelihood");
    filters.relevance = await DataModel.distinct("relevance");
    filters.source = await DataModel.distinct("source");

    res.json(filters);
  } catch {
    alert("Error fetching filter options");
    res.status(500).send("Error fetching filter options");
  }
});

// API route - Average Intensity Per Topic - Bar Chart
app.get("/bar-data", async (req, res) => {
  try {
    const { startYear, endYear, topic, region, country } = req.query;

    let matchStage = {};

    if (startYear && endYear) {
      matchStage.start_year = { $gte: parseInt(startYear, 10) };
      matchStage.end_year = { $lte: parseInt(endYear, 10) };
    } else if (startYear) {
      matchStage.start_year = { $gte: parseInt(startYear, 10) };
    } else if (endYear) {
      matchStage.end_year = { $lte: parseInt(endYear, 10) };
    }

    if (topic) matchStage.topic = topic;
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

// API route - Intensity-Likelihood-Relevance - Line Chart
app.get("/line-data", async (req, res) => {
  try {
    const { startYear, endYear } = req.query;

    let matchStage = {};

    if (startYear && endYear) {
      matchStage.start_year = { $gte: parseInt(startYear, 10) };
      matchStage.end_year = { $lte: parseInt(endYear, 10) };
    } else if (startYear) {
      matchStage.start_year = { $gte: parseInt(startYear, 10) };
    } else if (endYear) {
      matchStage.end_year = { $lte: parseInt(endYear, 10) };
    }

    const metrics = ["intensity", "likelihood", "relevance"];
    const dataPromises = metrics.map((metric) =>
      DataModel.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$start_year",
            averageValue: { $avg: `$${metric}` },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id",
            averageValue: 1,
            metric: metric,
          },
        },
        { $sort: { year: 1 } }, // Sort by year
      ])
    );

    const results = await Promise.all(dataPromises);

    // Flatten results and format data for chart
    const formattedData = metrics.reduce((acc, metric, index) => {
      const metricData = results[index];
      acc[metric] = metricData.map((item) => ({
        year: item.year,
        averageValue: item.averageValue,
      }));
      return acc;
    }, {});

    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching data for line chart:", err);
    res.status(500).send("Error fetching data for line chart");
  }
});

// API route - Region-wise Sector/Topic Distribution - Pie Chart
app.get("/pie-data", async (req, res) => {
  try {
    const { sector, region, type } = req.query;
    let matchStage = {};

    if (region) {
      matchStage.region = region;
    }

    if (sector) {
      matchStage.sector = sector;
    }

    const groupByField = type === "sector" ? "$sector" : "$topic";

    const data = await DataModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupByField,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(data);
  } catch (err) {
    console.error("Error fetching data for pie chart:", err);
    res.status(500).send("Error fetching data for pie chart");
  }
});

// API route - Average intensity and impact by PESTLE factor - Bar Chart
app.get("/pestle-intensity-impact-data", async (req, res) => {
  try {
    const { region, country } = req.query;
    let matchStage = {};

    if (region) {
      matchStage.region = region;
    }

    if (country) {
      matchStage.country = country;
    }

    const pestleData = await DataModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$pestle",
          averageIntensity: { $avg: "$intensity" },
          averageImpact: { $avg: "$impact" },
          averageLikelihood: { $avg: "$likelihood" },
          averageRelevance: { $avg: "$relevance" },
        },
      },
      {
        $project: {
          _id: 0,
          pestle: "$_id",
          averageIntensity: 1,
          averageImpact: 1,
          averageLikelihood: 1,
          averageRelevance: 1,
        },
      },
      { $sort: { averageIntensity: -1 } },
    ]);

    res.json(pestleData);
  } catch (err) {
    console.error(
      "Error fetching PESTLE intensity, impact, intensity and relevance data:",
      err
    );
    res
      .status(500)
      .send(
        "Error fetching PESTLE intensity, impact, intensity and relevance data"
      );
  }
});

// API route - No. of documents by Topic Distribution - Bubble Chart
app.get("/bubble-data", async (req, res) => {
  try {
    const { topic, region, country } = req.query;
    let matchStage = {};

    if (topic) {
      matchStage.topic = topic;
    }

    if (region) {
      matchStage.region = region;
    }

    if (country) {
      matchStage.country = country;
    }

    const data = await DataModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$topic",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          topic: "$_id",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(data);
  } catch (err) {
    console.error("Error fetching number of documents by Topic Data:", err);
    res.status(500).send("Error fetching number of documents by Topic Data");
  }
});

// API route - PESTLE and Source by Region
app.get("/heatmap-data", async (req, res) => {
  try {
    const { region, country, source } = req.query;
    let matchStage = {};

    if (region) {
      matchStage.region = region;
    }

    if (country) {
      matchStage.country = country;
    }

    if (source) {
      matchStage.source = source;
    }

    const heatmapData = await DataModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            region: "$region",
            source: { $ifNull: ["$source", "Unknown"] },
            pestle: { $ifNull: ["$pestle", "Unknown"] },
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: { region: "$_id.region", pestle: "$_id.pestle" },
          sources: {
            $push: { source: "$_id.source", count: "$count" },
          },
        },
      },
      {
        $project: {
          _id: 0,
          region: "$_id.region",
          pestle: "$_id.pestle",
          sources: 1,
        },
      },
    ]);

    res.json(heatmapData);
  } catch (err) {
    console.error("Error fetching heatmap data:", err);
    res.status(500).send("Error fetching heatmap data");
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
