let chartInstance = null;

// Average Intensity per Topic - Bar Chart
async function fetchBarChartData(filters = {}) {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`/data?${queryParams}`);
    const data = await response.json();

    if (data.length === 0) {
      alert("No data available for the selected filters.");
      return;
    }

    // Process and extract the data for visualization
    const labels = data.map((item) => item.sector || "Unknown");
    const values = data.map((item) => item.averageIntensity || 0);

    const ctx = document.getElementById("myChart").getContext("2d");

    // Clear the previous chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
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

// Intensity/Likelihood/Relevance over Years - Line Chart
async function fetchLineChartData(filters = {}, metric) {
  try {
    const queryParams = new URLSearchParams({ ...filters, metric }).toString();
    const response = await fetch(`/line-data?${queryParams}`);
    const data = await response.json();

    if (data.length === 0) {
      alert("No data available for the selected filters.");
      return;
    }

    // Process and extract the data for visualization
    const labels = data.map((item) => item.year);
    const values = data.map((item) => item.averageValue);

    const ctx = document.getElementById("lineChart").getContext("2d");

    // Clear the previous chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: `Average ${
              metric.charAt(0).toUpperCase() + metric.slice(1)
            } Over Time`,
            data: values,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: { display: true, text: "Year" },
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

async function populateFilters() {
  try {
    const response = await fetch("/filters");
    const filters = await response.json();

    if (!filters) {
      alert("No filter data available.");
      return;
    }

    populateSelect("endYearFilter", filters.endYear);
    populateSelect("startYearFilter", filters.startYear);
    populateSelect("topicsFilter", filters.topics);
    populateSelect("regionFilter", filters.region);
    populateSelect("countryFilter", filters.country);

    document
      .getElementById("regionFilter")
      .addEventListener("change", async function () {
        const selectedRegion = this.value;
        if (selectedRegion) {
          await populateCountryDropdown(selectedRegion);
        } else {
          populateSelect("countryFilter", []);
        }
      });
  } catch (error) {
    console.error("Failed to fetch filter options:", error);
  }
}

async function populateCountryDropdown(region) {
  try {
    const response = await fetch(`/countries?region=${region}`);
    const countries = await response.json();
    populateSelect("countryFilter", countries);
  } catch {
    alert("Failed to fetch countries");
  }
}

function populateSelect(id, options) {
  const selectElement = document.getElementById(id);
  selectElement.innerHTML = '<option value="">Select</option>'; // Reset to default option
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    selectElement.appendChild(optionElement);
  });
}

// Add event listener to the button to generate the bar chart
document.getElementById("generateChart").addEventListener("click", () => {
  const filters = {
    endYear: document.getElementById("endYearFilter").value,
    startYear: document.getElementById("startYearFilter").value,
    topics: document.getElementById("topicsFilter").value,
    region: document.getElementById("regionFilter").value,
    country: document.getElementById("countryFilter").value,
  };
  fetchBarChartData(filters);
});

// Add event listener to the button to generate the line chart
document.getElementById("generateLineChart").addEventListener("click", () => {
  const filters = {
    endYear: document.getElementById("endYearFilter").value,
    startYear: document.getElementById("startYearFilter").value,
    topics: document.getElementById("topicsFilter").value,
    region: document.getElementById("regionFilter").value,
    country: document.getElementById("countryFilter").value,
  };
  const metric = document.getElementById("metricFilter").value; // Metric for line chart
  fetchLineChartData(filters, metric);
});

// Fetch and populate filters initially
populateFilters();
