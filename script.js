let historyList = [];

function getValue(id) {
    return Number(document.getElementById(id).value) || 0;
}

function calculateMonthly(price, down, rate, tax, hoa) {
    let loan = price - down;
    let monthlyRate = (rate / 100) / 12;
    let payments = 30 * 12;

    let mortgage = 0;

    if (monthlyRate > 0) {
        mortgage = loan * (monthlyRate * Math.pow(1 + monthlyRate, payments)) /
                  (Math.pow(1 + monthlyRate, payments) - 1);
    } else {
        mortgage = loan / payments;
    }

    let monthlyTax = (price * (tax / 100)) / 12;
    let insurance = (price * 0.005) / 12;

    return Math.round(mortgage + monthlyTax + insurance + hoa);
}

function runComparison() {

    let priceA = getValue("priceA");
    let priceB = getValue("priceB");

    let spaceA = getValue("spaceA");
    let spaceB = getValue("spaceB");

    let locationA = getValue("locationA");
    let locationB = getValue("locationB");
   
    let commuteA = getValue("commuteA");
    let commuteB = getValue("commuteB");

    let downA = getValue("downA");
    let downB = getValue("downB");

    let rateA = getValue("rateA") || 6.8;
    let rateB = getValue("rateB") || 6.8;

    let taxA = getValue("taxA") || 1.2;
    let taxB = getValue("taxB") || 1.2;

    let hoaA = getValue("hoaA");
    let hoaB = getValue("hoaB");

    if (!priceA || !priceB || !spaceA || !spaceB) {
        document.getElementById("comparisonResult").textContent = "Enter values first.";
        return;
    }

    let monthlyA = calculateMonthly(priceA, downA, rateA, taxA, hoaA);
    let monthlyB = calculateMonthly(priceB, downB, rateB, taxB, hoaB);

    document.getElementById("monthlyCostRow").style.display = "grid";
    document.getElementById("monthlyA").textContent = "$" + monthlyA + "/mo";
    document.getElementById("monthlyB").textContent = "$" + monthlyB + "/mo";

    let result = "";
    let tradeoff = "";
    let buyer = "";
    let summary = [];

    // SIMPLE LOGIC

    if (monthlyA < monthlyB) {
        result = "Home A is the better option.";
        tradeoff = "Home A costs less per month.";

        buyer = "Better for a budget focused buyer.";

    } else if (monthlyB < monthlyA) {
        result = "Home B is the better option.";
        tradeoff = "Home B costs less per month.";

        buyer = "Better for a budget focused buyer.";

    } else {
        result = "Both homes cost about the same.";
        tradeoff = "Focus on space and location instead.";
        buyer = "Depends on personal preference.";
    }

    // SPACE
    if (spaceA > spaceB) {
        summary.push("Home A has more space.");
    } else if (spaceB > spaceA) {
        summary.push("Home B has more space.");
    }

    // LOCATION
    if (locationA > locationB) {
        summary.push("Home A has a better location.");
    } else if (locationB > locationA) {
        summary.push("Home B has a better location.");
    }
    // COMMUTE TIME
    if (commuteA && commuteB) {
    if (commuteA < commuteB) {
        summary.push("Home A has a shorter commute.");
    } else if (commuteB < commuteA) {
        summary.push("Home B has a shorter commute.");
    } else {
        summary.push("Both homes have the same commute time.");
    }
    }

    // PRICE
    if (priceA < priceB) {
        summary.push("Home A is cheaper.");
    } else if (priceB < priceA) {
        summary.push("Home B is cheaper.");
    }

    document.getElementById("comparisonResult").textContent = result;
    document.getElementById("tradeOffText").textContent = tradeoff;
    document.getElementById("buyerType").textContent = buyer;

    let list = document.getElementById("summaryList");
    list.innerHTML = "";

    summary.forEach(function(item) {
        let li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });

    saveHistory(result, monthlyA, monthlyB);
}

function saveHistory(result, monthlyA, monthlyB) {
    historyList.push({
        result: result,
        monthlyA: monthlyA,
        monthlyB: monthlyB
    });

    let section = document.getElementById("historySection");
    let list = document.getElementById("historyList");

    section.style.display = "block";
    list.innerHTML = "";

    historyList.forEach(function(item) {
        let div = document.createElement("div");
        div.textContent = item.result + " (A: $" + item.monthlyA + " | B: $" + item.monthlyB + ")";
        list.appendChild(div);
    });
}

function resetForm() {
    document.querySelectorAll("input").forEach(function(input) {
        input.value = "";
    });

    document.getElementById("comparisonResult").textContent = "Enter values to begin analysis.";
    document.getElementById("tradeOffText").textContent = "";
    document.getElementById("buyerType").textContent = "";
    document.getElementById("summaryList").innerHTML = "";

    document.getElementById("monthlyCostRow").style.display = "none";
}

function printResults() {
    window.print();
}

function copyResults() {
    let text = document.getElementById("comparisonResult").textContent;
    navigator.clipboard.writeText(text);
}