document.addEventListener("DOMContentLoaded", () => {
  const hours = Array.from({ length: 24 }, (_, i) => i + 1);
  const hourlyCharts = [];
  const mcpPoints = []; // Array to store MCP points for all hours

  const demandData = JSON.parse(localStorage.getItem("demandData")) || {};
  const productionData =
    JSON.parse(localStorage.getItem("productionData")) || {};

  hours.forEach((hour) => {
    const canvas = document.createElement("canvas");
    canvas.classList.add("hourly-chart");
    document.body.appendChild(canvas);

    const demands = [];
    const demandPrices = [];
    const productions = [];
    const prodPrices = [];

    // Collect user demands and prices for this hour
    Object.values(demandData).forEach((user) => {
      demands.push(parseInt(user.demands[hour - 1]));
      demandPrices.push(parseFloat(user.prices[hour - 1]));
    });

    // Collect provider productions and prices for this hour
    Object.values(productionData).forEach((provider) => {
      productions.push(parseInt(provider.productions[hour - 1]));
      prodPrices.push(parseFloat(provider.prices[hour - 1]));
    });

    // Sort demands in descending order and productions in ascending order by price
    const sortedDemands = demands
      .map((demand, i) => ({ demand, price: demandPrices[i] }))
      .sort((a, b) => b.price - a.price);
    const sortedProductions = productions
      .map((prod, i) => ({ production: prod, price: prodPrices[i] }))
      .sort((a, b) => a.price - b.price);

    // Calculate cumulative demands and productions
    const cumulativeDemand = sortedDemands.reduce((acc, cur) => {
      acc.push({
        x: acc.length ? acc[acc.length - 1].x + cur.demand : cur.demand,
        y: cur.price,
      });
      return acc;
    }, []);

    const cumulativeProduction = sortedProductions.reduce((acc, cur) => {
      acc.push({
        x: acc.length ? acc[acc.length - 1].x + cur.production : cur.production,
        y: cur.price,
      });
      return acc;
    }, []);

    // Find MCP (Market Clearing Price) point for this hour
    let mcpPoint = null;
    for (let i = 0; i < cumulativeDemand.length; i++) {
      for (let j = 0; j < cumulativeProduction.length; j++) {
        if (cumulativeDemand[i].x >= cumulativeProduction[j].x) {
          if (cumulativeDemand[i].y <= cumulativeProduction[j].y) {
            mcpPoint = {
              x: hour,
              y: (cumulativeDemand[i].y + cumulativeProduction[j].y) / 2, // Average of demand and production prices
            };
            break;
          }
        }
      }
      if (mcpPoint) break;
    }

    // Push MCP point into global array
    if (mcpPoint) {
      mcpPoints.push(mcpPoint);
    }

    // Define colors for user and provider curves
    const userColor = "blue";
    const providerColor = "red";

    // Create chart using Chart.js for this hour
    const ctx = canvas.getContext("2d");
    const hourlyChart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: `User Demand Hour ${hour}`,
            data: cumulativeDemand,
            borderColor: userColor,
            backgroundColor: userColor,
            showLine: true,
            fill: false,
          },
          {
            label: `Provider Production Hour ${hour}`,
            data: cumulativeProduction,
            borderColor: providerColor,
            backgroundColor: providerColor,
            showLine: true,
            fill: false,
          },
          {
            label: "MCP",
            data: mcpPoint ? [mcpPoint] : [],
            borderColor: "green",
            backgroundColor: "green",
            pointRadius: 5,
            pointHoverRadius: 7,
            type: "scatter",
            showLine: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            title: {
              display: true,
              text: "Mega Watt (MW)",
            },
          },
          y: {
            title: {
              display: true,
              text: "Price",
            },
          },
        },
      },
    });

    hourlyCharts.push(hourlyChart);
  });

  // Create MCP chart for all hours
  const mcpCanvas = document.createElement("canvas");
  mcpCanvas.id = "mcpChart";
  mcpCanvas.style.marginTop = "20px";
  document.body.appendChild(mcpCanvas);

  const mcpCtx = mcpCanvas.getContext("2d");

  // Create MCP chart using Chart.js for all hours
  new Chart(mcpCtx, {
    type: "line",
    data: {
      labels: hours.map((hour) => `Hour ${hour}`),
      datasets: [
        {
          label: "MCP Points",
          data: mcpPoints,
          borderColor: "green",
          backgroundColor: "green",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Hour",
          },
        },
        y: {
          title: {
            display: true,
            text: "MCP Price",
          },
        },
      },
    },
  });
});
