let barChartInstance = null;
let lineChartInstance = null;
let pieChartInstance = null;
let barPestleChartInstance = null;
let bubbleChartInstance = null;
let heatmapInstance = null;

let startYear = null;
let endYear = null;

// Average Intensity Per Topic - Bar Chart
async function fetchBarChart(filters = {}) {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`/bar-data?${queryParams}`);
    const data = await response.json();

    if (data.length === 0) {
      alert("No data available for the selected filters.");
      return;
    }

    const labels = data.map((item) => item.sector || "Unknown");
    const values = data.map((item) => item.averageIntensity || 0);

    const ctx = document.getElementById("barChart").getContext("2d");

    if (barChartInstance) {
      barChartInstance.destroy();
    }

    barChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Average Intensity by Topic",
            data: values,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

// Intensity-Likelihood-Relevance - Line Chart
async function fetchLineChart(filters = {}) {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`/line-data?${queryParams}`);
    const data = await response.json();

    if (!data || !data.intensity || !data.likelihood || !data.relevance) {
      alert("No data available for the selected filters.");
      return;
    }

    const ctx = document.getElementById("lineChart").getContext("2d");

    if (lineChartInstance) {
      lineChartInstance.destroy();
    }

    lineChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from(
          new Set([
            ...data.intensity.map((item) => item.year),
            ...data.likelihood.map((item) => item.year),
            ...data.relevance.map((item) => item.year),
          ])
        ),
        datasets: [
          {
            label: "Intensity",
            data: data.intensity.map((item) => ({
              x: item.year,
              y: item.averageValue,
            })),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false,
          },
          {
            label: "Likelihood",
            data: data.likelihood.map((item) => ({
              x: item.year,
              y: item.averageValue,
            })),
            borderColor: "rgba(255, 159, 64, 1)",
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            fill: false,
          },
          {
            label: "Relevance",
            data: data.relevance.map((item) => ({
              x: item.year,
              y: item.averageValue,
            })),
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: { display: true, text: "Year" },
            type: "linear",
            position: "bottom",
          },
          y: {
            title: { display: true, text: "Value" },
            beginAtZero: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

// Region-wise Sector/Topic Distribution - Pie chart
async function fetchPieChart(filters = {}) {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`/pie-data?${queryParams}`);
    const data = await response.json();

    if (data.length === 0) {
      alert("No data available for the selected filters.");
      return;
    }

    const labels = data.map((item) => item.name || "Unknown");
    const values = data.map((item) => item.count);

    const ctx = document.getElementById("pieChart").getContext("2d");

    if (pieChartInstance) {
      pieChartInstance.destroy();
    }

    pieChartInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Proportion",
            data: values,
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 205, 86, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(201, 203, 207, 0.2)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 205, 86, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(201, 203, 207, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

// Average intensity and impact by PESTLE factor - Bar Chart
async function fetchPestleBarData(filters = {}) {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(
      `/pestle-intensity-impact-data?${queryParams}`
    );
    const data = await response.json();

    if (data.length === 0) {
      alert("No PESTLE data available for the selected filters.");
      return;
    }

    const labels = data.map((item) => item.pestle || "Unknown");
    const intensityValues = data.map((item) => item.averageIntensity);
    const impactValues = data.map((item) => item.averageImpact);
    const likelihoodValues = data.map((item) => item.averageLikelihood);
    const relevanceValues = data.map((item) => item.averageRelevance);

    const ctx = document.getElementById("barChartPestle").getContext("2d");

    if (barPestleChartInstance) {
      barPestleChartInstance.destroy();
    }

    barPestleChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Average Intensity",
            data: intensityValues,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Average Impact",
            data: impactValues,
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          },
          {
            label: "Average Likelihood",
            data: likelihoodValues,
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
          {
            label: "Average Relevance",
            data: relevanceValues,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          x: {
            title: { display: true, text: "PESTLE Factor" },
          },
          y: {
            title: {
              display: true,
              text: "Average Intensity, Impact, Likelihood and Relevance",
            },
            beginAtZero: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch PESTLE intensity, impact, likelihood and relevance data:",
      error
    );
  }
}

// No. of documents by Topic - Bubble Chart
async function fetchBubbleChart(filters = {}) {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`/bubble-data?${queryParams}`);
    const data = await response.json();

    if (data.length === 0) {
      alert("No data available for the selected filters.");
      return;
    }

    // Create labels and map data
    const labels = data.map((item) => item.topic);
    const bubbleData = data.map((item) => ({
      x: labels.indexOf(item.topic),
      y: item.count,
      r: Math.sqrt(item.count) * 2,
      label: item.topic,
    }));

    const ctx = document.getElementById("bubbleChart").getContext("2d");

    if (bubbleChartInstance) {
      bubbleChartInstance.destroy();
    }

    bubbleChartInstance = new Chart(ctx, {
      type: "bubble",
      data: {
        datasets: [
          {
            label: "No. of Documents by Topic",
            data: bubbleData,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.raw.label || "Unknown";
                return `${label}: ${context.raw.y} documents`;
              },
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: "Topic" },
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 0,
              stepSize: 1,
              callback: function (value, index) {
                const label = labels[index] || "Unknown";
                return label.length > 10 ? `${label.slice(0, 10)}...` : label;
              },
            },
            grid: { display: false },
          },
          y: {
            title: { display: true, text: "No. of Documents" },
            beginAtZero: true,
          },
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 30,
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

// PESTLE and Source by Region - Heatmap
async function fetchHeatmap(filters = {}) {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`/heatmap-data?${queryParams}`);
    const data = await response.json();

    if (data.length === 0) {
      alert("No heatmap data available for the selected filters.");
      return;
    }

    const pestles = [...new Set(data.map((item) => item.pestle))];
    const sources = [
      ...new Set(data.flatMap((item) => item.sources.map((s) => s.source))),
    ];

    // Prepare the heatmap data
    const heatmapData = pestles.map((pestle) => {
      const row = sources.map((source) => {
        const item = data.find(
          (d) =>
            (d.pestle || "Unknown") === pestle &&
            d.sources.some((s) => (s.source || "Unknown") === source)
        );
        return item
          ? item.sources.find((s) => (s.source || "Unknown") === source)
              ?.count || 0
          : 0;
      });
      return row;
    });

    const ctx = document.getElementById("heatMap").getContext("2d");

    if (heatmapInstance) {
      heatmapInstance.destroy();
    }

    heatmapInstance = new Chart(ctx, {
      type: "matrix",
      data: {
        datasets: [
          {
            label: "PESTLE and Source by Region",
            data: heatmapData.flat().map((value, index) => ({
              x: index % sources.length,
              y: Math.floor(index / sources.length),
              v: value,
            })),
            backgroundColor: (context) => {
              const value = context.raw.v;
              const alpha = value / 100;
              return `rgba(255, 0, 0, ${alpha})`;
            },
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `Count: ${context.raw.v}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: "Source" },
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 0,
              stepSize: 5,
              callback: function (value, index) {
                const label = sources[index] || "Unknown";
                return label.length > 10 ? `${label.slice(0, 10)}...` : label;
              },
            },
          },
          y: {
            title: { display: true, text: "PESTLE" },
            ticks: {
              callback: function (value, index) {
                return pestles[index] || "Unknown";
              },
            },
          },
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 30,
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch heatmap data:", error);
  }
}

// Populate dropdowns and handle region-based country filtering
async function populateFilters() {
  try {
    const response = await fetch("/filters");
    const filters = await response.json();

    if (!filters) {
      alert("No filter data available.");
      return;
    }

    // Populate the dropdowns
    populateSelect("endYearFilterBar", filters.endYear);
    populateSelect("startYearFilterBar", filters.startYear);
    populateSelect("endYearFilterLine", filters.endYear);
    populateSelect("startYearFilterLine", filters.startYear);
    populateSelect("regionFilter", filters.region);
    populateSelect("regionFilterPie", filters.region);
    populateSelect("countryFilter", filters.country);
    populateSelect("regionFilterPestle", filters.region);
    populateSelect("countryFilterPestle", filters.country);
    populateSelect("topicFilterBubble", filters.topic);
    populateSelect("regionFilterBubble", filters.region);
    populateSelect("countryFilterBubble", filters.country);
    populateSelect("countryFilterHeat", filters.country);
    populateSelect("regionFilterHeat", filters.region);
    populateSelect("sourceFilterHeat", filters.source);

    // Extract year numbers and set the min and max values
    const startYearNumbers = filters.startYear
      .map((year) => parseInt(year, 10))
      .filter((num) => !isNaN(num));
    const endYearNumbers = filters.endYear
      .map((year) => parseInt(year, 10))
      .filter((num) => !isNaN(num));

    startYear = startYearNumbers.length ? Math.min(...startYearNumbers) : null;
    endYear = endYearNumbers.length ? Math.max(...endYearNumbers) : null;

    if (startYear !== null) {
      document.getElementById("startYearFilterBar").value = startYear;
      document.getElementById("startYearFilterLine").value = startYear;
    }
    if (endYear !== null) {
      document.getElementById("endYearFilterBar").value = endYear;
      document.getElementById("endYearFilterLine").value = endYear;
    }

    document
      .getElementById("regionFilter")
      .addEventListener("change", async function () {
        await populateCountryDropdown(this.value);
      });

    document
      .getElementById("regionFilterPestle")
      .addEventListener("change", async function () {
        await populateCountryDropdown(this.value);
      });

    document
      .getElementById("regionFilterBubble")
      .addEventListener("change", async function () {
        await populateCountryDropdown(this.value);
      });

    document
      .getElementById("regionFilterHeat")
      .addEventListener("change", async function () {
        await populateCountryDropdown(this.value);
      });
  } catch (error) {
    console.error("Failed to fetch filter options:", error);
  }
}

// Fetch and populate country dropdown based on selected region
async function populateCountryDropdown(region) {
  try {
    const response = await fetch(`/countries?region=${region}`);
    const countries = await response.json();
    populateSelect("countryFilter", countries);
    populateSelect("countryFilterPestle", countries);
    populateSelect("countryFilterBubble", countries);
    populateSelect("countryFilterHeat", countries);
  } catch {
    alert("Failed to fetch countries");
  }
}

// Populate dropdowns with list of options
function populateSelect(id, options) {
  const selectElement = document.getElementById(id);
  selectElement.innerHTML = '<option value="">Select</option>';
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option || "Unknown";
    optionElement.textContent = option || "Unknown";
    selectElement.appendChild(optionElement);
  });
}

// Validate that the start year is not greater than the end year
function validateYearRange(startYear, endYear) {
  if (startYear && endYear && parseInt(startYear, 10) > parseInt(endYear, 10)) {
    alert(
      "Start Year cannot be greater than End Year. Please correct the values."
    );
    return false;
  }
  return true;
}

// Event listener for Bar chart
document.getElementById("generateBarChart").addEventListener("click", () => {
  // Use global variables for default values
  const startYear =
    document.getElementById("startYearFilterBar").value || window.minStartYear;
  const endYear =
    document.getElementById("endYearFilterBar").value || window.maxEndYear;
  const region = document.getElementById("regionFilter").value;
  const country = document.getElementById("countryFilter").value;

  if (!validateYearRange(startYear, endYear)) {
    return;
  }

  const filters = {
    startYear,
    endYear,
    region,
    country,
  };
  fetchBarChart(filters);
});

// Event listener for Line chart
document.getElementById("generateLineChart").addEventListener("click", () => {
  // Use global variables for default values
  const startYear =
    document.getElementById("startYearFilterLine").value || window.minStartYear;
  const endYear =
    document.getElementById("endYearFilterLine").value || window.maxEndYear;

  if (!validateYearRange(startYear, endYear)) {
    return;
  }

  const filters = {
    startYear,
    endYear,
  };
  fetchLineChart(filters);
});

// Event listener for Pie chart
document.getElementById("generatePieChart").addEventListener("click", () => {
  const region = document.getElementById("regionFilterPie").value;
  const type = document.getElementById("filterType").value;
  fetchPieChart({ region, type });
});

// Event listener for Bar chart - PESTLE
document
  .getElementById("generateBarChartPestle")
  .addEventListener("click", () => {
    const filters = {
      region: document.getElementById("regionFilterPestle").value,
      country: document.getElementById("countryFilterPestle").value,
    };
    fetchPestleBarData(filters);
  });

// Event listener for Bubble chart
document.getElementById("generateBubbleChart").addEventListener("click", () => {
  const filters = {
    topic: document.getElementById("topicFilterBubble").value,
    region: document.getElementById("regionFilterBubble").value,
    country: document.getElementById("countryFilterBubble").value,
  };
  fetchBubbleChart(filters);
});

// Event listener for Heatmap
document.getElementById("generateHeatmap").addEventListener("click", () => {
  const region = document.getElementById("regionFilterHeat").value;
  const country = document.getElementById("countryFilterHeat").value;
  const source = document.getElementById("sourceFilterHeat").value;

  const filters = {
    region,
    country,
    source,
  };

  fetchHeatmap(filters);
});

// Fetch and populate filters initially
populateFilters();

// Generate charts with no-values on page reload
populateFilters().then(() => {
  if (startYear !== null && endYear !== null) {
    fetchBarChart({ startYear, endYear });
    fetchLineChart({ startYear, endYear });
  } else {
    console.error("startYear or endYear is not defined.");
  }
  fetchPieChart();
  fetchPestleBarData();
  fetchBubbleChart();
  fetchHeatmap();
});
