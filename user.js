document.addEventListener("DOMContentLoaded", () => {
  const demandForm = document.getElementById("demandForm");
  const clearButton = document.getElementById("clearDemand");

  const defaultDemandValues = [
    100, 120, 150, 130, 110, 90, 140, 160, 180, 200, 220, 240, 210, 190, 170,
    150, 130, 120, 110, 100, 90, 80, 70, 60,
  ];
  const defaultDemandPrices = [
    10, 12, 15, 13, 11, 9, 14, 16, 18, 20, 22, 24, 21, 19, 17, 15, 13, 12, 11,
    10, 9, 8, 7, 6,
  ];

  const createInputs = (containerId) => {
    const container = document.getElementById(containerId);
    const savedData = JSON.parse(localStorage.getItem("demandData")) || {};

    for (let i = 0; i < 24; i++) {
      const demandRow = document.createElement("div");
      demandRow.classList.add("inputs-row");

      const userKey = containerId.replace("Inputs", "");
      const savedDemands = savedData[userKey]?.demands || defaultDemandValues;
      const savedPrices = savedData[userKey]?.prices || defaultDemandPrices;

      demandRow.innerHTML = `
        <label>Hour ${
          i + 1
        }: <input type="number" step="any" name="demand" value="${
        savedDemands[i]
      }" required></label>
        <label>Price: <input type="number" step="any" name="price" value="${
          savedPrices[i]
        }" required></label>
      `;
      container.appendChild(demandRow);
    }
  };

  [
    "user1Inputs",
    "user2Inputs",
    "user3Inputs",
    "user4Inputs",
    "user5Inputs",
    "user6Inputs",
  ].forEach(createInputs);

  demandForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {};
    [
      "user1Inputs",
      "user2Inputs",
      "user3Inputs",
      "user4Inputs",
      "user5Inputs",
      "user6Inputs",
    ].forEach((containerId, index) => {
      const container = document.getElementById(containerId);
      const demands = Array.from(
        container.querySelectorAll('input[name="demand"]')
      ).map((input) => parseFloat(input.value)); // Parse input values as floats
      const prices = Array.from(
        container.querySelectorAll('input[name="price"]')
      ).map((input) => parseFloat(input.value)); // Parse input values as floats
      data[`user${index + 1}`] = { demands, prices };
    });
    localStorage.setItem("demandData", JSON.stringify(data));
    alert("Data saved successfully!");
  });

  clearButton.addEventListener("click", () => {
    localStorage.removeItem("demandData");
    alert("Data cleared!");
    document.querySelectorAll("input").forEach((input) => (input.value = ""));
  });
});
