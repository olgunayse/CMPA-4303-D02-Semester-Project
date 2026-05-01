function setPreview(type, element) {
    const text = document.getElementById("previewText");
    const options = document.querySelectorAll(".options span");
    const startBtn = document.getElementById("startBtn");

    if (!text) return;

    options.forEach(function(opt) {
        opt.classList.remove("active");
    });

    if (element) {
        element.classList.add("active");
    }

    const messages = {
        price:    "Lower price increases flexibility and long-term financial stability.",
        space:    "More space improves comfort and long-term usability.",
        location: "Better location enhances lifestyle and resale value.",
        balance:  "Balanced decisions consider cost, livability, and overall lifestyle fit together."
    };

    text.textContent = messages[type];

    if (startBtn) {
        startBtn.href = "compare.html?priority=" + type;
    }
}


function setPriority(type, element) {
    const priorityField = document.getElementById("prioritySelect");
    const options = document.querySelectorAll(".compare-options span");

    if (!priorityField) return;

    priorityField.value = type;

    options.forEach(function(opt) {
        opt.classList.remove("active");
    });

    if (element) {
        element.classList.add("active");
    }

    runComparison();
}


function validateInputs(priceA, priceB, spaceA, spaceB, locationA, locationB) {
    let valid = true;

    const errorA = document.getElementById("locationA-error");
    const errorB = document.getElementById("locationB-error");

    if (errorA) errorA.textContent = "";
    if (errorB) errorB.textContent = "";

    if (!isNaN(locationA) && (locationA < 1 || locationA > 10)) {
        if (errorA) errorA.textContent = "Please enter a score between 1 and 10.";
        valid = false;
    }

    if (!isNaN(locationB) && (locationB < 1 || locationB > 10)) {
        if (errorB) errorB.textContent = "Please enter a score between 1 and 10.";
        valid = false;
    }

    return valid;
}


function getLabel(id, fallback) {
    const field = document.getElementById(id);
    const val = field ? field.value.trim() : "";
    return val !== "" ? val : fallback;
}

function formatPrice(num) {
    return "$" + Math.abs(num).toLocaleString();
}

function normalizeScore(valA, valB, higherIsBetter) {
    if (valA === valB) return [50, 50];
    const min = Math.min(valA, valB);
    const max = Math.max(valB, valA);
    const range = max - min;
    const scoreA = higherIsBetter
        ? ((valA - min) / range) * 100
        : ((max - valA) / range) * 100;
    const scoreB = 100 - scoreA;
    return [scoreA, scoreB];
}


// ── MONTHLY COST CALCULATOR ───────────────────────────────────────────────────
// Takes a home's price, down payment, interest rate, tax rate, and HOA
// and returns the estimated total monthly cost to own the home.
// This is the key feature — it shows what the home actually costs per month,
// not just what the listing price is.

function calculateMonthly(price, down, rate, taxRate, hoa) {

    var loanAmount = price - down;
    var monthlyRate = (rate / 100) / 12;
    var numPayments = 30 * 12; // 30-year mortgage

    // Standard mortgage formula (principal + interest)
    var mortgage = 0;
    if (monthlyRate > 0) {
        mortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))
                             / (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
        mortgage = loanAmount / numPayments;
    }

    // Property tax (annual rate divided by 12 for monthly)
    var tax = (price * (taxRate / 100)) / 12;

    // Home insurance estimate (~0.5% of home value per year)
    var insurance = (price * 0.005) / 12;

    // Add everything together
    var total = mortgage + tax + insurance + hoa;

    return Math.round(total);
}


function runComparison() {
    const priceAField    = document.getElementById("priceA");
    const priceBField    = document.getElementById("priceB");
    const spaceAField    = document.getElementById("spaceA");
    const spaceBField    = document.getElementById("spaceB");
    const locationAField = document.getElementById("locationA");
    const locationBField = document.getElementById("locationB");
    const priorityField  = document.getElementById("prioritySelect");

    if (!priceAField || !priceBField || !spaceAField || !spaceBField ||
        !locationAField || !locationBField || !priorityField) return;

    const priceA    = parseFloat(priceAField.value);
    const priceB    = parseFloat(priceBField.value);
    const spaceA    = parseFloat(spaceAField.value);
    const spaceB    = parseFloat(spaceBField.value);
    const locationA = parseFloat(locationAField.value);
    const locationB = parseFloat(locationBField.value);
    const priority  = priorityField.value;

    const result         = document.getElementById("comparisonResult");
    const note           = document.getElementById("tradeOffText");
    const buyerType      = document.getElementById("buyerType");
    const confidenceText = document.getElementById("confidenceText");
    const summaryList    = document.getElementById("summaryList");
    const homeA          = document.getElementById("homeA");
    const homeB          = document.getElementById("homeB");

    if (!result || !note || !buyerType || !confidenceText || !summaryList || !homeA || !homeB) return;

    homeA.classList.remove("winner");
    homeB.classList.remove("winner");
    const existingBadge = document.querySelectorAll(".recommended-badge");
    existingBadge.forEach(function(b) { b.remove(); });

    if (isNaN(priceA) || isNaN(priceB) || isNaN(spaceA) || isNaN(spaceB) ||
        isNaN(locationA) || isNaN(locationB)) {
        result.textContent         = "Enter values to begin analysis.";
        note.textContent           = "";
        buyerType.textContent      = "No buyer profile yet.";
        confidenceText.textContent = "Confidence statement will appear here.";
        summaryList.innerHTML      = "<li>Home A and Home B have not been compared yet.</li>";
        document.getElementById("monthlyCostRow").style.display = "none";
        return;
    }

    if (!validateInputs(priceA, priceB, spaceA, spaceB, locationA, locationB)) {
        result.textContent         = "Please correct the errors above.";
        note.textContent           = "";
        buyerType.textContent      = "";
        confidenceText.textContent = "";
        summaryList.innerHTML      = "";
        return;
    }

    const nameA = getLabel("nameA", "Home A");
    const nameB = getLabel("nameB", "Home B");

    // ── MONTHLY COST CALCULATION ──────────────────────────────────────────────
    // Read the extra monthly cost fields (use 0 if left blank)
    var downA = parseFloat(document.getElementById("downA").value) || 0;
    var rateA = parseFloat(document.getElementById("rateA").value) || 6.8;
    var taxA  = parseFloat(document.getElementById("taxA").value)  || 1.2;
    var hoaA  = parseFloat(document.getElementById("hoaA").value)  || 0;

    var downB = parseFloat(document.getElementById("downB").value) || 0;
    var rateB = parseFloat(document.getElementById("rateB").value) || 6.8;
    var taxB  = parseFloat(document.getElementById("taxB").value)  || 1.2;
    var hoaB  = parseFloat(document.getElementById("hoaB").value)  || 0;

    var monthlyA = calculateMonthly(priceA, downA, rateA, taxA, hoaA);
    var monthlyB = calculateMonthly(priceB, downB, rateB, taxB, hoaB);

    // Show the monthly cost cards
    var monthlyCostRow = document.getElementById("monthlyCostRow");
    monthlyCostRow.style.display = "grid";
    document.getElementById("monthlyNameA").textContent = nameA;
    document.getElementById("monthlyNameB").textContent = nameB;
    document.getElementById("monthlyA").textContent = "$" + monthlyA.toLocaleString() + "/mo";
    document.getElementById("monthlyB").textContent = "$" + monthlyB.toLocaleString() + "/mo";

    let resultText  = "";
    let noteText    = "";
    let buyerText   = "";
    let confidence  = "";
    let winningHome = "";

    const summaryItems = [];

    // ── SUMMARY BULLETS ───────────────────────────────────────────────────────

    // Price summary
    if (priceA < priceB) {
        var priceDiff = priceB - priceA;
        if (priceDiff < 10000) {
            summaryItems.push("Price: " + nameA + " is slightly cheaper, but the gap is small enough that it probably won't feel significant over time. Focus on space and location instead.");
        } else if (priceDiff < 50000) {
            summaryItems.push("Price: " + nameA + " costs " + formatPrice(priceDiff) + " less. That affects the monthly mortgage payment and how much the buyer keeps in savings after closing.");
        } else {
            summaryItems.push("Price: " + nameA + " costs " + formatPrice(priceDiff) + " less — a significant gap. Unless " + nameB + " offers something the buyer truly cannot find elsewhere, the lower price is hard to ignore.");
        }
    } else if (priceB < priceA) {
        var priceDiff = priceA - priceB;
        if (priceDiff < 10000) {
            summaryItems.push("Price: " + nameB + " is slightly cheaper, but the gap is small enough that it probably won't feel significant over time. Focus on space and location instead.");
        } else if (priceDiff < 50000) {
            summaryItems.push("Price: " + nameB + " costs " + formatPrice(priceDiff) + " less. That affects the monthly mortgage payment and how much the buyer keeps in savings after closing.");
        } else {
            summaryItems.push("Price: " + nameB + " costs " + formatPrice(priceDiff) + " less — a significant gap. Unless " + nameA + " offers something the buyer truly cannot find elsewhere, the lower price is hard to ignore.");
        }
    } else {
        summaryItems.push("Price: Both homes cost the same. The decision comes down to space and location.");
    }

    // Monthly cost summary — this is the new insight the tool provides
    var monthlyDiff = Math.abs(monthlyA - monthlyB);
    var cheaperMonthly = monthlyA < monthlyB ? nameA : nameB;
    var pricierMonthly = monthlyA < monthlyB ? nameB : nameA;

    if (monthlyDiff > 0) {
        if (monthlyA < monthlyB && priceA > priceB) {
            summaryItems.push("Monthly Cost: Even though " + nameA + " has a higher listing price, it actually costs " + formatPrice(monthlyDiff) + " less per month once mortgage, taxes, insurance, and HOA are factored in. The cheaper listing is not always the cheaper home.");
        } else if (monthlyB < monthlyA && priceB > priceA) {
            summaryItems.push("Monthly Cost: Even though " + nameB + " has a higher listing price, it actually costs " + formatPrice(monthlyDiff) + " less per month once mortgage, taxes, insurance, and HOA are factored in. The cheaper listing is not always the cheaper home.");
        } else {
            summaryItems.push("Monthly Cost: " + cheaperMonthly + " costs " + formatPrice(monthlyDiff) + " less per month to own. Over 5 years that adds up to " + formatPrice(monthlyDiff * 60) + " — a number worth putting in front of the buyer.");
        }
    }

    // Space summary
    if (spaceA > spaceB) {
        summaryItems.push("Space: " + nameA + " has " + Math.abs(spaceA - spaceB).toLocaleString() + " more square feet. That could mean an extra bedroom, a home office, or just more room to grow into.");
    } else if (spaceB > spaceA) {
        summaryItems.push("Space: " + nameB + " has " + Math.abs(spaceA - spaceB).toLocaleString() + " more square feet. That could mean an extra bedroom, a home office, or just more room to grow into.");
    } else {
        summaryItems.push("Space: Both homes are the same size. Size is not a factor in this comparison.");
    }

    // Location summary
    if (locationA > locationB) {
        summaryItems.push("Location: " + nameA + " has a stronger location score. Location affects the daily commute, school district, and what the home is worth when it comes time to sell. It is the one thing a buyer cannot change after moving in.");
    } else if (locationB > locationA) {
        summaryItems.push("Location: " + nameB + " has a stronger location score. Location affects the daily commute, school district, and what the home is worth when it comes time to sell. It is the one thing a buyer cannot change after moving in.");
    } else {
        summaryItems.push("Location: Both homes score equally. Focus on price and space to separate them.");
    }

    // ── PRIORITY LOGIC ────────────────────────────────────────────────────────

    if (priority === "price") {
        if (priceA < priceB) {
            resultText  = nameA + " is the better choice based on price.";
            noteText    = "It costs less upfront, which means a lower monthly payment and more financial flexibility after closing.";
            buyerText   = "Best for: a first-time buyer or anyone keeping a close eye on their budget.";
            confidence  = Math.abs(priceA - priceB) >= 25000
                ? "Strong recommendation — the price difference is large enough to matter."
                : "Moderate recommendation — the gap is small, so space and location are worth looking at too.";
            winningHome = "A";
        } else if (priceB < priceA) {
            resultText  = nameB + " is the better choice based on price.";
            noteText    = "It costs less upfront, which means a lower monthly payment and more financial flexibility after closing.";
            buyerText   = "Best for: a first-time buyer or anyone keeping a close eye on their budget.";
            confidence  = Math.abs(priceA - priceB) >= 25000
                ? "Strong recommendation — the price difference is large enough to matter."
                : "Moderate recommendation — the gap is small, so space and location are worth looking at too.";
            winningHome = "B";
        } else {
            resultText = "Both homes are the same price, so this priority does not apply.";
            noteText   = "Since price is equal, look at space and location to find the difference.";
            buyerText  = "Best for: a buyer who should now compare space and location instead.";
            confidence = "No recommendation — both homes cost the same.";
        }

    } else if (priority === "space") {
        if (spaceA > spaceB) {
            resultText  = nameA + " is the better choice based on space.";
            noteText    = "More square footage means more room for a growing family, a home office, or just day-to-day comfort.";
            buyerText   = "Best for: a growing family or anyone who needs extra room to work or live comfortably.";
            confidence  = Math.abs(spaceA - spaceB) >= 300
                ? "Strong recommendation — the size difference is large enough to feel in daily life."
                : "Moderate recommendation — the difference is small. Think about whether the buyer will actually use the extra space.";
            winningHome = "A";
        } else if (spaceB > spaceA) {
            resultText  = nameB + " is the better choice based on space.";
            noteText    = "More square footage means more room for a growing family, a home office, or just day-to-day comfort.";
            buyerText   = "Best for: a growing family or anyone who needs extra room to work or live comfortably.";
            confidence  = Math.abs(spaceA - spaceB) >= 300
                ? "Strong recommendation — the size difference is large enough to feel in daily life."
                : "Moderate recommendation — the difference is small. Think about whether the buyer will actually use the extra space.";
            winningHome = "B";
        } else {
            resultText = "Both homes are the same size, so this priority does not apply.";
            noteText   = "Since size is equal, look at price and location to find the difference.";
            buyerText  = "Best for: a buyer who should now compare price and location instead.";
            confidence = "No recommendation — both homes are the same size.";
        }

    } else if (priority === "location") {
        if (locationA > locationB) {
            resultText  = nameA + " has the stronger location.";
            noteText    = "A better location affects the daily commute, school district, and the home's resale value. It is also the one thing a buyer cannot change after moving in.";
            buyerText   = "Best for: a buyer who cares about commute time, school quality, or long-term resale value.";
            confidence  = Math.abs(locationA - locationB) >= 2
                ? "Strong recommendation — the location gap is meaningful."
                : "Moderate recommendation — the gap is narrow. Visit both neighborhoods before deciding.";
            winningHome = "A";
        } else if (locationB > locationA) {
            resultText  = nameB + " has the stronger location.";
            noteText    = "A better location affects the daily commute, school district, and the home's resale value. It is also the one thing a buyer cannot change after moving in.";
            buyerText   = "Best for: a buyer who cares about commute time, school quality, or long-term resale value.";
            confidence  = Math.abs(locationA - locationB) >= 2
                ? "Strong recommendation — the location gap is meaningful."
                : "Moderate recommendation — the gap is narrow. Visit both neighborhoods before deciding.";
            winningHome = "B";
        } else {
            resultText = "Both homes score equally on location, so this priority does not apply.";
            noteText   = "Since location is equal, look at price and space to find the difference.";
            buyerText  = "Best for: a buyer who should now compare price and space instead.";
            confidence = "No recommendation — both homes have the same location score.";
        }

    } else {
        const [priceScoreA, priceScoreB]       = normalizeScore(priceA, priceB, false);
        const [spaceScoreA, spaceScoreB]       = normalizeScore(spaceA, spaceB, true);
        const [locationScoreA, locationScoreB] = normalizeScore(locationA, locationB, true);

        const scoreA = (priceScoreA + spaceScoreA + locationScoreA) / 3;
        const scoreB = (priceScoreB + spaceScoreB + locationScoreB) / 3;

        if (scoreA > scoreB) {
            resultText  = nameA + " is the better overall choice.";
            noteText    = "It holds up well across all three factors — price, space, and location. A home that is solid across the board is harder to find than one that wins on just one thing.";
            buyerText   = "Best for: a buyer who wants a home that makes sense on price, space, and location — not just one of them.";
            confidence  = Math.abs(scoreA - scoreB) >= 20
                ? "Strong recommendation — " + nameA + " has a clear overall advantage."
                : "Moderate recommendation — " + nameA + " edges ahead, but both homes are close. Personal priorities may change the answer.";
            winningHome = "A";
        } else if (scoreB > scoreA) {
            resultText  = nameB + " is the better overall choice.";
            noteText    = "It holds up well across all three factors — price, space, and location. A home that is solid across the board is harder to find than one that wins on just one thing.";
            buyerText   = "Best for: a buyer who wants a home that makes sense on price, space, and location — not just one of them.";
            confidence  = Math.abs(scoreA - scoreB) >= 20
                ? "Strong recommendation — " + nameB + " has a clear overall advantage."
                : "Moderate recommendation — " + nameB + " edges ahead, but both homes are close. Personal priorities may change the answer.";
            winningHome = "B";
        } else {
            resultText = "Both homes are evenly matched overall.";
            noteText   = "The numbers do not pick a clear winner here. Ask the buyer which trade-off they can live with — that will make the decision.";
            buyerText  = "Best for: a buyer who needs to think about what matters most to them personally.";
            confidence = "No strong recommendation — this comes down to the buyer's own priorities.";
        }
    }

    result.textContent         = resultText;
    note.textContent           = noteText;
    buyerType.textContent      = buyerText;
    confidenceText.textContent = confidence;

    summaryList.innerHTML = "";
    summaryItems.forEach(function(item) {
        const li = document.createElement("li");
        li.textContent = item;
        summaryList.appendChild(li);
    });

    if (winningHome === "A") {
        homeA.classList.add("winner");
        addRecommendedBadge(homeA);
    } else if (winningHome === "B") {
        homeB.classList.add("winner");
        addRecommendedBadge(homeB);
    }

    saveToHistory(resultText, nameA, nameB, priceA, priceB, spaceA, spaceB, locationA, locationB, priority, monthlyA, monthlyB);
}


function addRecommendedBadge(panel) {
    const badge = document.createElement("p");
    badge.className = "recommended-badge";
    badge.textContent = "Recommended";
    panel.insertBefore(badge, panel.firstChild);
}


var comparisonHistory = [];

function saveToHistory(resultText, nameA, nameB, priceA, priceB, spaceA, spaceB, locationA, locationB, priority, monthlyA, monthlyB) {
    var now = new Date();
    var timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    var entry = {
        number: comparisonHistory.length + 1,
        time: timeStr,
        result: resultText,
        nameA: nameA,
        nameB: nameB,
        priceA: priceA,
        priceB: priceB,
        monthlyA: monthlyA,
        monthlyB: monthlyB,
        spaceA: spaceA,
        spaceB: spaceB,
        locationA: locationA,
        locationB: locationB,
        priority: priority
    };

    comparisonHistory.unshift(entry);
    renderHistory();
}

function renderHistory() {
    var section = document.getElementById("historySection");
    var list = document.getElementById("historyList");
    if (!section || !list) return;

    section.style.display = "block";
    list.innerHTML = "";

    comparisonHistory.forEach(function(entry) {
        var div = document.createElement("div");
        div.className = "history-entry";
        div.innerHTML =
            '<div class="history-meta">' +
                '<span class="history-number">Comparison ' + entry.number + '</span>' +
                '<span class="history-timestamp">' + entry.time + ' &mdash; Priority: ' + entry.priority.charAt(0).toUpperCase() + entry.priority.slice(1) + '</span>' +
            '</div>' +
            '<p class="history-winner">' + entry.result + '</p>' +
            '<p class="history-detail">' + entry.nameA + ': $' + entry.priceA.toLocaleString() + ' &middot; ' + entry.spaceA.toLocaleString() + ' sqft &middot; Location ' + entry.locationA + '/10 &middot; ~$' + entry.monthlyA.toLocaleString() + '/mo</p>' +
            '<p class="history-detail">' + entry.nameB + ': $' + entry.priceB.toLocaleString() + ' &middot; ' + entry.spaceB.toLocaleString() + ' sqft &middot; Location ' + entry.locationB + '/10 &middot; ~$' + entry.monthlyB.toLocaleString() + '/mo</p>';
        list.appendChild(div);
    });
}

function clearHistory() {
    comparisonHistory = [];
    var section = document.getElementById("historySection");
    var list = document.getElementById("historyList");
    if (section) section.style.display = "none";
    if (list) list.innerHTML = "";
}

function printResults() {
    var resultEl = document.getElementById("comparisonResult");
    if (!resultEl || resultEl.textContent === "Enter values to begin analysis." || resultEl.textContent === "Please fill in all fields.") {
        alert("Please run a comparison first before printing.");
        return;
    }
    window.print();
}

function copyResults() {
    const result       = document.getElementById("comparisonResult");
    const note         = document.getElementById("tradeOffText");
    const buyerType    = document.getElementById("buyerType");
    const confidence   = document.getElementById("confidenceText");
    const summaryItems = document.querySelectorAll("#summaryList li");
    const monthlyA     = document.getElementById("monthlyA");
    const monthlyB     = document.getElementById("monthlyB");
    const nameA        = document.getElementById("monthlyNameA");
    const nameB        = document.getElementById("monthlyNameB");

    if (!result) return;

    let text = "SMARTER COMPARISONS — RESULTS\n\n";
    if (monthlyA && monthlyB) {
        text += "Monthly Cost: " + (nameA ? nameA.textContent : "Home A") + " " + monthlyA.textContent + " | " + (nameB ? nameB.textContent : "Home B") + " " + monthlyB.textContent + "\n\n";
    }
    text += "Recommendation: " + result.textContent + "\n";
    if (note && note.textContent) text += note.textContent + "\n";
    text += "\n" + (buyerType ? buyerType.textContent : "") + "\n";
    text += (confidence ? confidence.textContent : "") + "\n";
    text += "\nSummary of Trade Offs:\n";
    summaryItems.forEach(function(li) {
        text += "- " + li.textContent + "\n";
    });

    navigator.clipboard.writeText(text).then(function() {
        const btn = document.querySelector(".button[onclick='copyResults()']");
        if (btn) {
            const original = btn.textContent;
            btn.textContent = "Copied!";
            setTimeout(function() { btn.textContent = original; }, 2000);
        }
    }).catch(function() {
        alert("Could not copy. Please select and copy the results manually.");
    });
}

function resetForm() {
    const inputs          = document.querySelectorAll("input[type='number'], input[type='text']");
    const summaryList     = document.getElementById("summaryList");
    const result          = document.getElementById("comparisonResult");
    const note            = document.getElementById("tradeOffText");
    const buyerType       = document.getElementById("buyerType");
    const confidenceText  = document.getElementById("confidenceText");
    const prioritySelect  = document.getElementById("prioritySelect");
    const homeA           = document.getElementById("homeA");
    const homeB           = document.getElementById("homeB");
    const priorityOptions = document.querySelectorAll(".compare-options span");
    const errors          = document.querySelectorAll(".field-error");
    const badges          = document.querySelectorAll(".recommended-badge");

    inputs.forEach(function(input) { input.value = ""; });
    errors.forEach(function(e) { e.textContent = ""; });
    badges.forEach(function(b) { b.remove(); });

    if (prioritySelect) prioritySelect.value = "price";

    priorityOptions.forEach(function(opt) { opt.classList.remove("active"); });
    if (priorityOptions[0]) priorityOptions[0].classList.add("active");

    if (result)         result.textContent         = "Enter values to begin analysis.";
    if (note)           note.textContent            = "";
    if (buyerType)      buyerType.textContent       = "No buyer profile yet.";
    if (confidenceText) confidenceText.textContent  = "Confidence statement will appear here.";
    if (summaryList)    summaryList.innerHTML       = "<li>Home A and Home B have not been compared yet.</li>";
    if (homeA)          homeA.classList.remove("winner");
    if (homeB)          homeB.classList.remove("winner");

    document.getElementById("monthlyCostRow").style.display = "none";
}


document.addEventListener("DOMContentLoaded", function() {
    const firstPreview = document.querySelector(".options span");
    if (firstPreview && document.getElementById("previewText")) {
        firstPreview.click();
    }

    const params = new URLSearchParams(window.location.search);
    const urlPriority = params.get("priority");
    if (urlPriority) {
        const matchingSpan = document.querySelector(
            ".compare-options span[onclick*=\"'" + urlPriority + "'\"]"
        );
        if (matchingSpan) {
            matchingSpan.click();
        }
    }

    const liveFields = document.querySelectorAll(
        "#priceA, #priceB, #spaceA, #spaceB, #locationA, #locationB, #nameA, #nameB, #downA, #downB, #rateA, #rateB, #taxA, #taxB, #hoaA, #hoaB"
    );
    liveFields.forEach(function(field) {
        field.addEventListener("input", runComparison);
        field.addEventListener("change", runComparison);
    });
});