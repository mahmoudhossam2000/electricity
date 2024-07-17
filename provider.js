document.addEventListener("DOMContentLoaded", () => {
  const providerForm = document.getElementById("providerForm");
  const clearButton = document.getElementById("clearProvider");

  const defaultProductionValues = [
    60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210,
    220, 230, 240, 250, 260, 270, 280, 290,
  ];
  const defaultProductionPrices = [
    6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29,
  ];

  const createInputs = (containerId) => {
    const container = document.getElementById(containerId);
    const savedData = JSON.parse(localStorage.getItem("productionData")) || {};

    for (let i = 0; i < 24; i++) {
      const productionRow = document.createElement("div");
      productionRow.classList.add("inputs-row");

      const providerKey = containerId.replace("Inputs", "");
      const savedProductions =
        savedData[providerKey]?.productions || defaultProductionValues;
      const savedPrices =
        savedData[providerKey]?.prices || defaultProductionPrices;

      productionRow.innerHTML = `
        <label>Hour ${
          i + 1
        }: <input type="number" step="any" name="production" value="${
        savedProductions[i]
      }" required></label>
        <label>Price: <input type="number" step="any" name="prodPrice" value="${
          savedPrices[i]
        }" required></label>
      `;
      container.appendChild(productionRow);
    }
  };

  [
    "provider1Inputs",
    "provider2Inputs",
    "provider3Inputs",
    "provider4Inputs",
  ].forEach(createInputs);

  providerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {};
    [
      "provider1Inputs",
      "provider2Inputs",
      "provider3Inputs",
      "provider4Inputs",
    ].forEach((containerId, index) => {
      const container = document.getElementById(containerId);
      const productions = Array.from(
        container.querySelectorAll('input[name="production"]')
      ).map((input) => parseFloat(input.value)); // Parse input values as floats
      const prices = Array.from(
        container.querySelectorAll('input[name="prodPrice"]')
      ).map((input) => parseFloat(input.value)); // Parse input values as floats
      data[`provider${index + 1}`] = { productions, prices };
    });
    localStorage.setItem("productionData", JSON.stringify(data));
    alert("Data saved successfully!");
  });

  clearButton.addEventListener("click", () => {
    localStorage.removeItem("productionData");
    alert("Data cleared!");
    document.querySelectorAll("input").forEach((input) => (input.value = ""));
  });
});
