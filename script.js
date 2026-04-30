function getNumber(id) {
  return Number(document.getElementById(id).value) || 0;
}

function calculateMonthlyCost(price, hoa, downPaymentPercent, interestRatePercent, taxRatePercent, insurance) {
  const downPayment = price * (downPaymentPercent / 100);
  const loanAmount = price - downPayment;

  const monthlyInterestRate = interestRatePercent / 100 / 12;
  const numberOfPayments = 30 * 12;

  let mortgage = 0;

  if (monthlyInterestRate > 0) {
    mortgage =
      loanAmount *
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  } else {
    mortgage = loanAmount / numberOfPayments;
  }

  const monthlyTax = (price * (taxRatePercent / 100)) / 12;
  const totalMonthlyCost = mortgage + monthlyTax + insurance + hoa;

  return totalMonthlyCost;
}

function compareHomes() {
  const priceA = getNumber("priceA");
  const sqftA = getNumber("sqftA");
  const bedsA = getNumber("bedsA");
  const locationA = getNumber("locationA");
  const hoaA = getNumber("hoaA");

  const priceB = getNumber("priceB");
  const sqftB = getNumber("sqftB");
  const bedsB = getNumber("bedsB");
  const locationB = getNumber("locationB");
  const hoaB = getNumber("hoaB");

  const downPayment = getNumber("downPayment");
  const interestRate = getNumber("interestRate");
  const taxRate = getNumber("taxRate");
  const insurance = getNumber("insurance");

  if (priceA === 0 || priceB === 0 || sqftA === 0 || sqftB === 0) {
    alert("Please enter at least the price and square footage for both homes.");
    return;
  }

  const monthlyCostA = calculateMonthlyCost(priceA, hoaA, downPayment, interestRate, taxRate, insurance);
  const monthlyCostB = calculateMonthlyCost(priceB, hoaB, downPayment, interestRate, taxRate, insurance);

  const pricePerSqftA = priceA / sqftA;
  const pricePerSqftB = priceB / sqftB;

  document.getElementById("monthlyA").textContent =
    "Home A estimated monthly cost: $" + monthlyCostA.toFixed(0);

  document.getElementById("monthlyB").textContent =
    "Home B estimated monthly cost: $" + monthlyCostB.toFixed(0);

  let tradeoff = "";

  if (monthlyCostA < monthlyCostB && sqftA < sqftB) {
    tradeoff = "Home A has the lower monthly cost, but Home B gives the buyer more space.";
  } else if (monthlyCostB < monthlyCostA && sqftB < sqftA) {
    tradeoff = "Home B has the lower monthly cost, but Home A gives the buyer more space.";
  } else if (monthlyCostA < monthlyCostB) {
    tradeoff = "Home A is the more affordable option based on the estimated monthly cost.";
  } else if (monthlyCostB < monthlyCostA) {
    tradeoff = "Home B is the more affordable option based on the estimated monthly cost.";
  } else {
    tradeoff = "Both homes have a very similar estimated monthly cost.";
  }

  document.getElementById("tradeoff").textContent = "Tradeoff: " + tradeoff;

  let buyerType = "";

  if (monthlyCostA < monthlyCostB && pricePerSqftA < pricePerSqftB) {
    buyerType = "Home A may be better for a budget-focused buyer who wants stronger value for the price.";
  } else if (monthlyCostB < monthlyCostA && pricePerSqftB < pricePerSqftA) {
    buyerType = "Home B may be better for a budget-focused buyer who wants stronger value for the price.";
  } else if (sqftA > sqftB && bedsA >= bedsB) {
    buyerType = "Home A may be better for a buyer who cares more about space and comfort.";
  } else if (sqftB > sqftA && bedsB >= bedsA) {
    buyerType = "Home B may be better for a buyer who cares more about space and comfort.";
  } else if (locationA > locationB) {
    buyerType = "Home A may be better for a buyer who values location more than cost.";
  } else if (locationB > locationA) {
    buyerType = "Home B may be better for a buyer who values location more than cost.";
  } else {
    buyerType = "Both homes could fit a similar buyer, depending on their personal priorities.";
  }

  document.getElementById("buyerType").textContent = "Buyer Fit: " + buyerType;

  let agentSummary = "";

  if (monthlyCostA < monthlyCostB) {
    agentSummary =
      "Agent Summary: Emphasize that Home A may be easier to afford month to month. If the client is worried about budget, this is the stronger point to explain.";
  } else if (monthlyCostB < monthlyCostA) {
    agentSummary =
      "Agent Summary: Emphasize that Home B may be easier to afford month to month. If the client is worried about budget, this is the stronger point to explain.";
  } else {
    agentSummary =
      "Agent Summary: Since the monthly costs are close, focus more on space, location, bedrooms, and long-term comfort.";
  }

  document.getElementById("agentSummary").textContent = agentSummary;
}

function resetForm() {
  const inputs = document.querySelectorAll("input");

  inputs.forEach(function(input) {
    input.value = "";
  });

  document.getElementById("monthlyA").textContent = "";
  document.getElementById("monthlyB").textContent = "";
  document.getElementById("tradeoff").textContent = "";
  document.getElementById("buyerType").textContent = "";
  document.getElementById("agentSummary").textContent = "";
}