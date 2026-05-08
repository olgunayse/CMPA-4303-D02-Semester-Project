let historyList = [];

function getValue(id) {
    var el = document.getElementById(id);
    if (!el) return 0;
    return Number(el.value) || 0;
}

function setPreview(type, element) {
    var options = document.querySelectorAll(".options span");
    var text = document.getElementById("previewText");

    options.forEach(function(opt) {
        opt.classList.remove("active");
    });
    if (element) element.classList.add("active");
    if (!text) return;

    if (type === "price") {
        text.textContent = "Lower price increases flexibility and long-term financial stability.";
    } else if (type === "space") {
        text.textContent = "More space improves comfort and long-term usability.";
    } else if (type === "location") {
        text.textContent = "Better location enhances lifestyle and resale value.";
    } else if (type === "balance") {
        text.textContent = "Balanced decisions consider cost, livability, and overall lifestyle fit together.";
    }
}

function setPriority(type, element) {
    var priorityField = document.getElementById("prioritySelect");
    var options = document.querySelectorAll(".compare-options span");
    if (!priorityField) return;
    priorityField.value = type;
    options.forEach(function(opt) { opt.classList.remove("active"); });
    if (element) element.classList.add("active");

    // Activate step 2
    activateStep(2);

    runComparison();
}

function activateStep(num) {
    for (var i = 1; i <= 3; i++) {
        var el = document.getElementById("step" + i);
        if (el) {
            if (i <= num) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        }
    }
}

function calculateMonthly(price, down, rate, tax, hoa) {
    var loan = price - down;
    var monthlyRate = (rate / 100) / 12;
    var payments = 30 * 12;
    var mortgage = 0;

    if (monthlyRate > 0) {
        mortgage = loan * (monthlyRate * Math.pow(1 + monthlyRate, payments)) /
                  (Math.pow(1 + monthlyRate, payments) - 1);
    } else {
        mortgage = loan / payments;
    }

    var monthlyTax = (price * (tax / 100)) / 12;
    var insurance = (price * 0.005) / 12;
    return Math.round(mortgage + monthlyTax + insurance + hoa);
}

// Normalize a value between 0 and 100 relative to two values
// higherIsBetter = true means bigger number scores higher
function normalize(valA, valB, higherIsBetter) {
    if (valA === valB) return [50, 50];
    var min = Math.min(valA, valB);
    var max = Math.max(valA, valB);
    var range = max - min;
    var scoreA = higherIsBetter
        ? ((valA - min) / range) * 100
        : ((max - valA) / range) * 100;
    return [Math.round(scoreA), Math.round(100 - scoreA)];
}

function runComparison() {
    var priceA    = getValue("priceA");
    var priceB    = getValue("priceB");
    var spaceA    = getValue("spaceA");
    var spaceB    = getValue("spaceB");
    var locationA = getValue("locationA");
    var locationB = getValue("locationB");
    var commuteA  = getValue("commuteA");
    var commuteB  = getValue("commuteB");
    var downA     = getValue("downA");
    var downB     = getValue("downB");
    var rateA     = getValue("rateA") || 6.8;
    var rateB     = getValue("rateB") || 6.8;
    var taxA      = getValue("taxA") || 1.2;
    var taxB      = getValue("taxB") || 1.2;
    var hoaA      = getValue("hoaA");
    var hoaB      = getValue("hoaB");

    var nameA = document.getElementById("nameA").value.trim() || "Home A";
    var nameB = document.getElementById("nameB").value.trim() || "Home B";

    if (!priceA || !priceB || !spaceA || !spaceB) {
        document.getElementById("comparisonResult").textContent = "Enter values to begin analysis.";
        document.getElementById("scoreCardsRow").style.display = "none";
        document.getElementById("barChartSection").style.display = "none";
        document.getElementById("monthlyCostRow").style.display = "none";
        return;
    }

    // Activate step 3
    activateStep(3);

    var monthlyA = calculateMonthly(priceA, downA, rateA, taxA, hoaA);
    var monthlyB = calculateMonthly(priceB, downB, rateB, taxB, hoaB);

    // Monthly cost display
    document.getElementById("monthlyCostRow").style.display = "grid";
    document.getElementById("monthlyNameA").textContent = nameA;
    document.getElementById("monthlyNameB").textContent = nameB;
    document.getElementById("monthlyA").textContent = "$" + monthlyA.toLocaleString() + "/mo";
    document.getElementById("monthlyB").textContent = "$" + monthlyB.toLocaleString() + "/mo";

    // --- SCORE CALCULATION ---
    // Lower monthly cost = better, more space = better, higher location = better
    var costScores    = normalize(monthlyA, monthlyB, false);
    var spaceScores   = normalize(spaceA, spaceB, true);
    var locScores     = normalize(locationA, locationB, true);

    var totalScoreA = Math.round((costScores[0] + spaceScores[0] + locScores[0]) / 3);
    var totalScoreB = Math.round((costScores[1] + spaceScores[1] + locScores[1]) / 3);

    // Show score cards
    document.getElementById("scoreCardsRow").style.display = "grid";
    document.getElementById("scoreNameA").textContent = nameA;
    document.getElementById("scoreNameB").textContent = nameB;
    document.getElementById("scoreA").textContent = totalScoreA;
    document.getElementById("scoreB").textContent = totalScoreB;

    // Reset badges and card styles
    document.getElementById("badgeA").style.display = "none";
    document.getElementById("badgeB").style.display = "none";
    document.getElementById("scoreCardA").classList.remove("score-card-winner");
    document.getElementById("scoreCardB").classList.remove("score-card-winner");

    if (totalScoreA > totalScoreB) {
        document.getElementById("badgeA").style.display = "block";
        document.getElementById("scoreCardA").classList.add("score-card-winner");
    } else if (totalScoreB > totalScoreA) {
        document.getElementById("badgeB").style.display = "block";
        document.getElementById("scoreCardB").classList.add("score-card-winner");
    }

    // --- BAR CHART ---
    document.getElementById("barChartSection").style.display = "block";
    document.getElementById("legendNameA").textContent = nameA;
    document.getElementById("legendNameB").textContent = nameB;

    // Monthly cost bars — lower is better so invert for visual
    var maxCost = Math.max(monthlyA, monthlyB);
    document.getElementById("barCostA").style.width = Math.round((monthlyA / maxCost) * 100) + "%";
    document.getElementById("barCostB").style.width = Math.round((monthlyB / maxCost) * 100) + "%";
    document.getElementById("barCostAVal").textContent = "$" + monthlyA.toLocaleString();
    document.getElementById("barCostBVal").textContent = "$" + monthlyB.toLocaleString();

    // Space bars
    var maxSpace = Math.max(spaceA, spaceB);
    document.getElementById("barSpaceA").style.width = (maxSpace > 0 ? Math.round((spaceA / maxSpace) * 100) : 0) + "%";
    document.getElementById("barSpaceB").style.width = (maxSpace > 0 ? Math.round((spaceB / maxSpace) * 100) : 0) + "%";
    document.getElementById("barSpaceAVal").textContent = spaceA.toLocaleString() + " sqft";
    document.getElementById("barSpaceBVal").textContent = spaceB.toLocaleString() + " sqft";

    // Location bars
    var maxLoc = Math.max(locationA, locationB, 1);
    document.getElementById("barLocA").style.width = Math.round((locationA / maxLoc) * 100) + "%";
    document.getElementById("barLocB").style.width = Math.round((locationB / maxLoc) * 100) + "%";
    document.getElementById("barLocAVal").textContent = locationA + "/10";
    document.getElementById("barLocBVal").textContent = locationB + "/10";

    // --- RESULT TEXT ---
    var result = "";
    var tradeoff = "";
    var buyer = "";
    var summary = [];

    if (monthlyA < monthlyB) {
        result = nameA + " costs less per month to own.";
        tradeoff = nameA + " costs $" + (monthlyB - monthlyA).toLocaleString() + " less per month once mortgage, tax, insurance, and HOA are factored in. Over 5 years that is $" + ((monthlyB - monthlyA) * 60).toLocaleString() + " in savings.";
        buyer = "Better for a buyer who wants to keep monthly costs as low as possible.";
    } else if (monthlyB < monthlyA) {
        result = nameB + " costs less per month to own.";
        tradeoff = nameB + " costs $" + (monthlyA - monthlyB).toLocaleString() + " less per month once mortgage, tax, insurance, and HOA are factored in. Over 5 years that is $" + ((monthlyA - monthlyB) * 60).toLocaleString() + " in savings.";
        buyer = "Better for a buyer who wants to keep monthly costs as low as possible.";
    } else {
        result = "Both homes cost about the same per month.";
        tradeoff = "Monthly costs are equal. Focus on space and location to make the decision.";
        buyer = "Depends on personal lifestyle priorities.";
    }

    if (spaceA > spaceB) {
        summary.push(nameA + " has " + (spaceA - spaceB).toLocaleString() + " more square feet — that could mean an extra bedroom or home office.");
    } else if (spaceB > spaceA) {
        summary.push(nameB + " has " + (spaceB - spaceA).toLocaleString() + " more square feet — that could mean an extra bedroom or home office.");
    }

    if (locationA > locationB) {
        summary.push(nameA + " has a stronger location score. Location affects commute, school district, and long-term resale value.");
    } else if (locationB > locationA) {
        summary.push(nameB + " has a stronger location score. Location affects commute, school district, and long-term resale value.");
    }

    if (commuteA && commuteB) {
        if (commuteA < commuteB) {
            summary.push(nameA + " has a shorter commute by " + (commuteB - commuteA) + " minutes each way.");
        } else if (commuteB < commuteA) {
            summary.push(nameB + " has a shorter commute by " + (commuteA - commuteB) + " minutes each way.");
        }
    }

    if (priceA < priceB) {
        summary.push(nameA + " has a lower listing price by $" + (priceB - priceA).toLocaleString() + ".");
    } else if (priceB < priceA) {
        summary.push(nameB + " has a lower listing price by $" + (priceA - priceB).toLocaleString() + ".");
    }

    document.getElementById("comparisonResult").textContent = result;
    document.getElementById("tradeOffText").textContent = tradeoff;
    document.getElementById("buyerType").textContent = buyer;
    document.getElementById("confidenceText").textContent = totalScoreA !== totalScoreB
        ? "Based on price, space, and location, " + (totalScoreA > totalScoreB ? nameA : nameB) + " scores " + Math.abs(totalScoreA - totalScoreB) + " points higher overall."
        : "Both homes score equally overall. The decision comes down to personal priorities.";

    var list = document.getElementById("summaryList");
    list.innerHTML = "";
    summary.forEach(function(item) {
        var li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });

    // Remove old winner badges from panels
    document.querySelectorAll(".recommended-badge").forEach(function(b) { b.remove(); });
    document.getElementById("homeA").classList.remove("winner");
    document.getElementById("homeB").classList.remove("winner");

    if (totalScoreA > totalScoreB) {
        document.getElementById("homeA").classList.add("winner");
    } else if (totalScoreB > totalScoreA) {
        document.getElementById("homeB").classList.add("winner");
    }

    saveHistory(result, monthlyA, monthlyB, nameA, nameB);
}

function saveHistory(result, monthlyA, monthlyB, nameA, nameB) {
    historyList.push({ result: result, monthlyA: monthlyA, monthlyB: monthlyB, nameA: nameA, nameB: nameB });

    var section = document.getElementById("historySection");
    var list = document.getElementById("historyList");
    section.style.display = "block";
    list.innerHTML = "";

    historyList.forEach(function(item, index) {
        var div = document.createElement("div");
        div.className = "history-entry";
        div.innerHTML =
            '<div class="history-meta">' +
                '<span class="history-number">Comparison ' + (index + 1) + '</span>' +
            '</div>' +
            '<p class="history-winner">' + item.result + '</p>' +
            '<p class="history-detail">' + item.nameA + ': $' + item.monthlyA.toLocaleString() + '/mo &nbsp;|&nbsp; ' + item.nameB + ': $' + item.monthlyB.toLocaleString() + '/mo</p>';
        list.appendChild(div);
    });
}

function clearHistory() {
    historyList = [];
    var section = document.getElementById("historySection");
    var list = document.getElementById("historyList");
    if (section) section.style.display = "none";
    if (list) list.innerHTML = "";
}

function resetForm() {
    document.querySelectorAll("input").forEach(function(input) { input.value = ""; });
    document.getElementById("comparisonResult").textContent = "Enter values to begin analysis.";
    document.getElementById("tradeOffText").textContent = "";
    document.getElementById("buyerType").textContent = "";
    document.getElementById("confidenceText").textContent = "";
    document.getElementById("summaryList").innerHTML = "<li>Home A and Home B have not been compared yet.</li>";
    document.getElementById("monthlyCostRow").style.display = "none";
    document.getElementById("scoreCardsRow").style.display = "none";
    document.getElementById("barChartSection").style.display = "none";
    document.getElementById("homeA").classList.remove("winner");
    document.getElementById("homeB").classList.remove("winner");
    document.getElementById("badgeA").style.display = "none";
    document.getElementById("badgeB").style.display = "none";
    document.getElementById("scoreCardA").classList.remove("score-card-winner");
    document.getElementById("scoreCardB").classList.remove("score-card-winner");
    activateStep(1);
}

function printResults() {
    window.print();
}

function copyResults() {
    var result = document.getElementById("comparisonResult").textContent;
    var tradeoff = document.getElementById("tradeOffText").textContent;
    var buyer = document.getElementById("buyerType").textContent;
    var items = document.querySelectorAll("#summaryList li");
    var text = "SMARTER COMPARISONS\n\n" + result + "\n" + tradeoff + "\n\n" + buyer + "\n\nSummary:\n";
    items.forEach(function(li) { text += "- " + li.textContent + "\n"; });
    navigator.clipboard.writeText(text).then(function() {
        var btn = document.querySelector(".button[onclick='copyResults()']");
        if (btn) {
            var orig = btn.textContent;
            btn.textContent = "Copied!";
            setTimeout(function() { btn.textContent = orig; }, 2000);
        }
    });
}