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

    options.forEach(function(opt) {
        opt.classList.remove("active");
    });

    if (element) element.classList.add("active");

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

    if (loan < 0) {
        loan = 0;
    }

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
    var priceA = getValue("priceA");
    var priceB = getValue("priceB");
    var spaceA = getValue("spaceA");
    var spaceB = getValue("spaceB");
    var locationA = getValue("locationA");
    var locationB = getValue("locationB");
    var commuteA = getValue("commuteA");
    var commuteB = getValue("commuteB");

    var downA = getValue("downA");
    var downB = getValue("downB");
    var rateA = getValue("rateA") || 6.8;
    var rateB = getValue("rateB") || 6.8;
    var taxA = getValue("taxA") || 1.2;
    var taxB = getValue("taxB") || 1.2;
    var hoaA = getValue("hoaA");
    var hoaB = getValue("hoaB");

    var nameA = document.getElementById("nameA").value.trim() || "Home A";
    var nameB = document.getElementById("nameB").value.trim() || "Home B";
    var priority = document.getElementById("prioritySelect").value;

    document.querySelectorAll(".recommended-badge").forEach(function(badge) {
        badge.remove();
    });

    document.getElementById("homeA").classList.remove("winner");
    document.getElementById("homeB").classList.remove("winner");

    if (!priceA || !priceB || !spaceA || !spaceB) {
        document.getElementById("comparisonResult").textContent = "Enter price and square footage for both homes to begin analysis.";
        document.getElementById("tradeOffText").textContent = "";
        document.getElementById("buyerType").textContent = "No buyer profile yet.";
        document.getElementById("scoreCardsRow").style.display = "none";
        document.getElementById("barChartSection").style.display = "none";
        document.getElementById("monthlyCostRow").style.display = "none";
        return;
    }

    activateStep(3);

    var monthlyA = calculateMonthly(priceA, downA, rateA, taxA, hoaA);
    var monthlyB = calculateMonthly(priceB, downB, rateB, taxB, hoaB);

    document.getElementById("monthlyCostRow").style.display = "grid";
    document.getElementById("monthlyNameA").textContent = nameA;
    document.getElementById("monthlyNameB").textContent = nameB;
    document.getElementById("monthlyA").textContent = "$" + monthlyA.toLocaleString() + "/mo";
    document.getElementById("monthlyB").textContent = "$" + monthlyB.toLocaleString() + "/mo";

    var costScores = normalize(monthlyA, monthlyB, false);
    var spaceScores = normalize(spaceA, spaceB, true);
    var locScores = normalize(locationA, locationB, true);

    var totalScoreA = Math.round((costScores[0] + spaceScores[0] + locScores[0]) / 3);
    var totalScoreB = Math.round((costScores[1] + spaceScores[1] + locScores[1]) / 3);

    document.getElementById("scoreCardsRow").style.display = "grid";
    document.getElementById("scoreNameA").textContent = nameA;
    document.getElementById("scoreNameB").textContent = nameB;
    document.getElementById("scoreA").textContent = totalScoreA;
    document.getElementById("scoreB").textContent = totalScoreB;

    document.getElementById("badgeA").style.display = "none";
    document.getElementById("badgeB").style.display = "none";
    document.getElementById("scoreCardA").classList.remove("score-card-winner");
    document.getElementById("scoreCardB").classList.remove("score-card-winner");

   var winner = "";

if (priority === "price") {
    if (monthlyA < monthlyB) {
        winner = "A";
    } else if (monthlyB < monthlyA) {
        winner = "B";
    }
}

else if (priority === "space") {
    if (spaceA > spaceB) {
        winner = "A";
    } else if (spaceB > spaceA) {
        winner = "B";
    }
}

else if (priority === "location") {
    if (locationA > locationB) {
        winner = "A";
    } else if (locationB > locationA) {
        winner = "B";
    }
}

else if (priority === "balance") {
    if (totalScoreA > totalScoreB) {
        winner = "A";
    } else if (totalScoreB > totalScoreA) {
        winner = "B";
    }
}

if (winner === "A") {
    document.getElementById("badgeA").style.display = "block";
    document.getElementById("scoreCardA").classList.add("score-card-winner");
    document.getElementById("homeA").classList.add("winner");
} else if (winner === "B") {
    document.getElementById("badgeB").style.display = "block";
    document.getElementById("scoreCardB").classList.add("score-card-winner");
    document.getElementById("homeB").classList.add("winner");
}

    document.getElementById("barChartSection").style.display = "block";
    document.getElementById("legendNameA").textContent = nameA;
    document.getElementById("legendNameB").textContent = nameB;

    var maxCost = Math.max(monthlyA, monthlyB);
    document.getElementById("barCostA").style.width = Math.round((monthlyA / maxCost) * 100) + "%";
    document.getElementById("barCostB").style.width = Math.round((monthlyB / maxCost) * 100) + "%";
    document.getElementById("barCostAVal").textContent = "$" + monthlyA.toLocaleString();
    document.getElementById("barCostBVal").textContent = "$" + monthlyB.toLocaleString();

    var maxSpace = Math.max(spaceA, spaceB);
    document.getElementById("barSpaceA").style.width = Math.round((spaceA / maxSpace) * 100) + "%";
    document.getElementById("barSpaceB").style.width = Math.round((spaceB / maxSpace) * 100) + "%";
    document.getElementById("barSpaceAVal").textContent = spaceA.toLocaleString() + " sqft";
    document.getElementById("barSpaceBVal").textContent = spaceB.toLocaleString() + " sqft";

    var maxLoc = Math.max(locationA, locationB, 1);
    document.getElementById("barLocA").style.width = Math.round((locationA / maxLoc) * 100) + "%";
    document.getElementById("barLocB").style.width = Math.round((locationB / maxLoc) * 100) + "%";
    document.getElementById("barLocAVal").textContent = locationA + "/10";
    document.getElementById("barLocBVal").textContent = locationB + "/10";

    var result = "";
    var tradeoff = "";
    var buyer = "";
    var summary = [];

    if (priority === "price") {
        if (monthlyA < monthlyB) {
            result = nameA + " is the better choice for affordability.";
            tradeoff = nameA + " costs $" + (monthlyB - monthlyA).toLocaleString() + " less per month once mortgage, tax, insurance, and HOA are included. Over 5 years, that is $" + ((monthlyB - monthlyA) * 60).toLocaleString() + " in savings.";
            buyer = "Better for a buyer who wants the lower monthly ownership cost.";
        } else if (monthlyB < monthlyA) {
            result = nameB + " is the better choice for affordability.";
            tradeoff = nameB + " costs $" + (monthlyA - monthlyB).toLocaleString() + " less per month once mortgage, tax, insurance, and HOA are included. Over 5 years, that is $" + ((monthlyA - monthlyB) * 60).toLocaleString() + " in savings.";
            buyer = "Better for a buyer who wants the lower monthly ownership cost.";
        } else {
            result = "Both homes are about equal for affordability.";
            tradeoff = "The monthly costs are the same, so space, location, and commute time may be better deciding factors.";
            buyer = "Better for a buyer who wants to compare lifestyle needs beyond cost.";
        }
    }

    else if (priority === "space") {
        if (spaceA > spaceB) {
            result = nameA + " is the better choice for space.";
            tradeoff = nameA + " has " + (spaceA - spaceB).toLocaleString() + " more square feet than " + nameB + ".";
            buyer = "Better for a buyer who wants more room, storage, flexibility, or long-term usability.";
        } else if (spaceB > spaceA) {
            result = nameB + " is the better choice for space.";
            tradeoff = nameB + " has " + (spaceB - spaceA).toLocaleString() + " more square feet than " + nameA + ".";
            buyer = "Better for a buyer who wants more room, storage, flexibility, or long-term usability.";
        } else {
            result = "Both homes offer the same amount of space.";
            tradeoff = "Because the square footage is equal, monthly cost, location, and commute time may be better deciding factors.";
            buyer = "Better for a buyer who wants to compare other factors besides size.";
        }
    }

    else if (priority === "location") {
        if (locationA > locationB) {
            result = nameA + " is the better choice for location.";
            tradeoff = nameA + " has a stronger location score than " + nameB + ".";
            buyer = "Better for a buyer who values commute, nearby amenities, neighborhood feel, or resale potential.";
        } else if (locationB > locationA) {
            result = nameB + " is the better choice for location.";
            tradeoff = nameB + " has a stronger location score than " + nameA + ".";
            buyer = "Better for a buyer who values commute, nearby amenities, neighborhood feel, or resale potential.";
        } else {
            result = "Both homes have the same location score.";
            tradeoff = "Because the location scores are equal, monthly cost, space, and commute time may be better deciding factors.";
            buyer = "Better for a buyer who is weighing lifestyle and financial trade offs together.";
        }
    }

    else if (priority === "balance") {
        if (totalScoreA > totalScoreB) {
            result = nameA + " is the stronger overall choice.";
            tradeoff = nameA + " has the higher overall score when monthly cost, space, and location are considered together.";
            buyer = "Better for a buyer who wants the most balanced option across cost, space, and location.";
        } else if (totalScoreB > totalScoreA) {
            result = nameB + " is the stronger overall choice.";
            tradeoff = nameB + " has the higher overall score when monthly cost, space, and location are considered together.";
            buyer = "Better for a buyer who wants the most balanced option across cost, space, and location.";
        } else {
            result = "Both homes are equally balanced overall.";
            tradeoff = "The total scores are the same, so the better choice depends on the buyer's personal priorities.";
            buyer = "Better for a buyer who wants to review the trade offs more closely before deciding.";
        }
    }

    if (spaceA > spaceB) {
        summary.push(nameA + " has " + (spaceA - spaceB).toLocaleString() + " more square feet.");
    } else if (spaceB > spaceA) {
        summary.push(nameB + " has " + (spaceB - spaceA).toLocaleString() + " more square feet.");
    } else {
        summary.push("Both homes have the same square footage.");
    }

    if (locationA > locationB) {
        summary.push(nameA + " has a stronger location score.");
    } else if (locationB > locationA) {
        summary.push(nameB + " has a stronger location score.");
    } else if (locationA && locationB) {
        summary.push("Both homes have the same location score.");
    }

    if (commuteA && commuteB) {
        if (commuteA < commuteB) {
            summary.push(nameA + " has a shorter commute by " + (commuteB - commuteA) + " minutes each way.");
        } else if (commuteB < commuteA) {
            summary.push(nameB + " has a shorter commute by " + (commuteA - commuteB) + " minutes each way.");
        } else {
            summary.push("Both homes have the same commute time.");
        }
    }

    if (priceA < priceB) {
        summary.push(nameA + " has a lower listing price by $" + (priceB - priceA).toLocaleString() + ".");
    } else if (priceB < priceA) {
        summary.push(nameB + " has a lower listing price by $" + (priceA - priceB).toLocaleString() + ".");
    } else {
        summary.push("Both homes have the same listing price.");
    }

    if (monthlyA < monthlyB) {
        summary.push(nameA + " has the lower estimated monthly cost.");
    } else if (monthlyB < monthlyA) {
        summary.push(nameB + " has the lower estimated monthly cost.");
    } else {
        summary.push("Both homes have the same estimated monthly cost.");
    }

    document.getElementById("comparisonResult").textContent = result;
    document.getElementById("tradeOffText").textContent = tradeoff;
    document.getElementById("buyerType").textContent = buyer;

    var list = document.getElementById("summaryList");
    list.innerHTML = "";

    summary.forEach(function(item) {
        var li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });

    saveHistory(result, nameA, nameB, monthlyA, monthlyB);
}

function saveHistory(result, nameA, nameB, monthlyA, monthlyB) {
    historyList.unshift({
        result: result,
        nameA: nameA,
        nameB: nameB,
        monthlyA: monthlyA,
        monthlyB: monthlyB
    });

    if (historyList.length > 5) {
        historyList.pop();
    }

    var section = document.getElementById("historySection");
    var list = document.getElementById("historyList");

    if (!section || !list) return;

    section.style.display = "block";
    list.innerHTML = "";

    historyList.forEach(function(item) {
        var div = document.createElement("div");
        div.className = "history-entry";

        div.innerHTML =
            '<p class="history-compact">' +
            '<strong>' + item.nameA + '</strong> vs <strong>' + item.nameB + '</strong>' +
            ' — ' + item.result +
            ' <span>$' + item.monthlyA.toLocaleString() + '/mo vs $' + item.monthlyB.toLocaleString() + '/mo</span>' +
            '</p>';

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
    document.querySelectorAll("input").forEach(function(input) {
        input.value = "";
    });

    document.getElementById("comparisonResult").textContent = "Enter values to begin analysis.";
    document.getElementById("tradeOffText").textContent = "";
    document.getElementById("buyerType").textContent = "No buyer profile yet.";
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

    items.forEach(function(li) {
        text += "- " + li.textContent + "\n";
    });

    navigator.clipboard.writeText(text).then(function() {
        var btn = document.querySelector(".button[onclick='copyResults()']");

        if (btn) {
            var original = btn.textContent;
            btn.textContent = "Copied!";

            setTimeout(function() {
                btn.textContent = original;
            }, 2000);
        }
    });
}