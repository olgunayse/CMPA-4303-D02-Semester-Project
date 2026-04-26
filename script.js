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
        price: "Lower price increases flexibility and long term financial stability.",
        space: "More space improves comfort and long term usability.",
        location: "Better location enhances lifestyle and resale value.",
        balance: "Balanced decisions consider cost, livability, and overall lifestyle fit together."
    };

    text.textContent = messages[type];

    // Update the Start Analysis link to carry the selected priority
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

// Normalize a value: returns 100 if it "wins" on this factor, 0 if tied, 0-100 scaled otherwise.
// For price: lower is better. For space/location: higher is better.
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

    // Remove winner state
    homeA.classList.remove("winner");
    homeB.classList.remove("winner");
    const existingBadge = document.querySelectorAll(".recommended-badge");
    existingBadge.forEach(function(b) { b.remove(); });

    // If any numeric field is empty, reset output
    if (isNaN(priceA) || isNaN(priceB) || isNaN(spaceA) || isNaN(spaceB) ||
        isNaN(locationA) || isNaN(locationB)) {
        result.textContent       = "Please fill in all fields.";
        note.textContent         = "";
        buyerType.textContent    = "No buyer profile yet.";
        confidenceText.textContent = "Confidence statement will appear here.";
        summaryList.innerHTML    = "<li>Home A and Home B have not been compared yet.</li>";
        return;
    }

    // Validate location range
    if (!validateInputs(priceA, priceB, spaceA, spaceB, locationA, locationB)) {
        result.textContent       = "Please correct the errors above.";
        note.textContent         = "";
        buyerType.textContent    = "";
        confidenceText.textContent = "";
        summaryList.innerHTML    = "";
        return;
    }

    const nameA = getLabel("nameA", "Home A");
    const nameB = getLabel("nameB", "Home B");

    let resultText = "";
    let noteText   = "";
    let buyerText  = "";
    let confidence = "";
    let winningHome = "";

    // ── Summary with real deltas ──
    const summaryItems = [];

    if (priceA < priceB) {
        summaryItems.push(nameA + " is " + formatPrice(priceB - priceA) + " less expensive.");
    } else if (priceB < priceA) {
        summaryItems.push(nameB + " is " + formatPrice(priceA - priceB) + " less expensive.");
    } else {
        summaryItems.push("Both homes are equal in price.");
    }

    if (spaceA > spaceB) {
        summaryItems.push(nameA + " has " + Math.abs(spaceA - spaceB).toLocaleString() + " more square feet.");
    } else if (spaceB > spaceA) {
        summaryItems.push(nameB + " has " + Math.abs(spaceA - spaceB).toLocaleString() + " more square feet.");
    } else {
        summaryItems.push("Both homes offer the same amount of space.");
    }

    if (locationA > locationB) {
        summaryItems.push(nameA + " scores " + (locationA - locationB) + " point(s) higher on location.");
    } else if (locationB > locationA) {
        summaryItems.push(nameB + " scores " + (locationB - locationA) + " point(s) higher on location.");
    } else {
        summaryItems.push("Both homes have the same location score.");
    }

    // ── Priority logic ──
    if (priority === "price") {
        if (priceA < priceB) {
            resultText  = nameA + " is the stronger price-focused choice.";
            noteText    = "It offers a lower entry point and greater financial flexibility.";
            buyerText   = "Best for: first-time buyer or budget-conscious buyer.";
            confidence  = Math.abs(priceA - priceB) >= 25000
                ? "This is a strong recommendation based on a meaningful price difference."
                : "This recommendation is moderate because the pricing difference is present but not dramatic.";
            winningHome = "A";
        } else if (priceB < priceA) {
            resultText  = nameB + " is the stronger price-focused choice.";
            noteText    = "It offers a lower entry point and greater financial flexibility.";
            buyerText   = "Best for: first-time buyer or budget-conscious buyer.";
            confidence  = Math.abs(priceA - priceB) >= 25000
                ? "This is a strong recommendation based on a meaningful price difference."
                : "This recommendation is moderate because the pricing difference is present but not dramatic.";
            winningHome = "B";
        } else {
            resultText = "Both homes are equally strong on price.";
            noteText   = "Price does not separate these options, so space and location become more important.";
            buyerText  = "Best for: buyer who wants to compare based on non-price priorities.";
            confidence = "Confidence is moderate because the homes are tied on the selected priority.";
        }

    } else if (priority === "space") {
        if (spaceA > spaceB) {
            resultText  = nameA + " is the stronger space-focused choice.";
            noteText    = "It offers more room for comfort, flexibility, and long-term livability.";
            buyerText   = "Best for: growing family or long-term owner.";
            confidence  = Math.abs(spaceA - spaceB) >= 300
                ? "This is a strong recommendation based on a noticeable space advantage."
                : "This recommendation is moderate because the size difference is relatively small.";
            winningHome = "A";
        } else if (spaceB > spaceA) {
            resultText  = nameB + " is the stronger space-focused choice.";
            noteText    = "It offers more room for comfort, flexibility, and long-term livability.";
            buyerText   = "Best for: growing family or long-term owner.";
            confidence  = Math.abs(spaceA - spaceB) >= 300
                ? "This is a strong recommendation based on a noticeable space advantage."
                : "This recommendation is moderate because the size difference is relatively small.";
            winningHome = "B";
        } else {
            resultText = "Both homes are equally strong on space.";
            noteText   = "Square footage does not separate these options, so price and location matter more.";
            buyerText  = "Best for: buyer who values layout, cost, and location more than raw square footage.";
            confidence = "Confidence is moderate because the homes are tied on the selected priority.";
        }

    } else if (priority === "location") {
        if (locationA > locationB) {
            resultText  = nameA + " is the stronger location-focused choice.";
            noteText    = "It offers stronger positioning, convenience, and lifestyle value.";
            buyerText   = "Best for: lifestyle-focused buyer or resale-minded buyer.";
            confidence  = Math.abs(locationA - locationB) >= 2
                ? "This is a strong recommendation based on a clear location advantage."
                : "This recommendation is moderate because the location scores are fairly close.";
            winningHome = "A";
        } else if (locationB > locationA) {
            resultText  = nameB + " is the stronger location-focused choice.";
            noteText    = "It offers stronger positioning, convenience, and lifestyle value.";
            buyerText   = "Best for: lifestyle-focused buyer or resale-minded buyer.";
            confidence  = Math.abs(locationA - locationB) >= 2
                ? "This is a strong recommendation based on a clear location advantage."
                : "This recommendation is moderate because the location scores are fairly close.";
            winningHome = "B";
        } else {
            resultText = "Both homes are equally strong on location.";
            noteText   = "Location does not separate these options, so price and space carry more weight.";
            buyerText  = "Best for: buyer who wants to compare based on affordability or size.";
            confidence = "Confidence is moderate because the homes are tied on the selected priority.";
        }

    } else {
        // Balance mode — normalized scoring
        const [priceScoreA, priceScoreB]       = normalizeScore(priceA, priceB, false);
        const [spaceScoreA, spaceScoreB]       = normalizeScore(spaceA, spaceB, true);
        const [locationScoreA, locationScoreB] = normalizeScore(locationA, locationB, true);

        const scoreA = (priceScoreA + spaceScoreA + locationScoreA) / 3;
        const scoreB = (priceScoreB + spaceScoreB + locationScoreB) / 3;

        if (scoreA > scoreB) {
            resultText  = nameA + " offers the stronger overall balance.";
            noteText    = "It presents the better blend of cost, space, and location based on the entered values.";
            buyerText   = "Best for: practical buyer seeking overall value.";
            confidence  = Math.abs(scoreA - scoreB) >= 20
                ? "This is a strong recommendation because one home shows a clearer overall advantage."
                : "This recommendation is moderate because both homes are fairly competitive overall.";
            winningHome = "A";
        } else if (scoreB > scoreA) {
            resultText  = nameB + " offers the stronger overall balance.";
            noteText    = "It presents the better blend of cost, space, and location based on the entered values.";
            buyerText   = "Best for: practical buyer seeking overall value.";
            confidence  = Math.abs(scoreA - scoreB) >= 20
                ? "This is a strong recommendation because one home shows a clearer overall advantage."
                : "This recommendation is moderate because both homes are fairly competitive overall.";
            winningHome = "B";
        } else {
            resultText = "Both homes offer a very similar overall balance.";
            noteText   = "This decision likely depends on personal preferences and buyer lifestyle.";
            buyerText  = "Best for: buyer who wants to look deeper at personal priorities before choosing.";
            confidence = "Confidence is moderate because the homes perform similarly across all three factors.";
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

    // Highlight winner
    if (winningHome === "A") {
        homeA.classList.add("winner");
        addRecommendedBadge(homeA);
    } else if (winningHome === "B") {
        homeB.classList.add("winner");
        addRecommendedBadge(homeB);
    }
}

function addRecommendedBadge(panel) {
    const badge = document.createElement("p");
    badge.className = "recommended-badge";
    badge.textContent = "Recommended";
    panel.insertBefore(badge, panel.firstChild);
}


function copyResults() {
    const result     = document.getElementById("comparisonResult");
    const note       = document.getElementById("tradeOffText");
    const buyerType  = document.getElementById("buyerType");
    const confidence = document.getElementById("confidenceText");
    const summaryItems = document.querySelectorAll("#summaryList li");

    if (!result) return;

    let text = "SMARTER COMPARISONS — RESULTS\n\n";
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

    if (result)        result.textContent        = "Enter values to begin analysis.";
    if (note)          note.textContent           = "";
    if (buyerType)     buyerType.textContent      = "No buyer profile yet.";
    if (confidenceText) confidenceText.textContent = "Confidence statement will appear here.";
    if (summaryList)   summaryList.innerHTML      = "<li>Home A and Home B have not been compared yet.</li>";
    if (homeA)         homeA.classList.remove("winner");
    if (homeB)         homeB.classList.remove("winner");
}

document.addEventListener("DOMContentLoaded", function() {

    // Home page: set default preview text and read URL param if returning
    const firstPreview = document.querySelector(".options span");
    if (firstPreview && document.getElementById("previewText")) {
        firstPreview.click();
    }

    // Compare page: read priority from URL param (set by Home page)
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

    // Live update on input
    const liveFields = document.querySelectorAll(
        "#priceA, #priceB, #spaceA, #spaceB, #locationA, #locationB, #nameA, #nameB"
    );
    liveFields.forEach(function(field) {
        field.addEventListener("input", runComparison);
        field.addEventListener("change", runComparison);
    });
});

function setStay(years, element) {
    const stayField = document.getElementById("stayYears");
    if (stayField) stayField.value = years;

    document.querySelectorAll(".stay-opt").forEach(function(opt) {
        opt.classList.remove("active");
    });
    if (element) element.classList.add("active");
}

function calcMonthlyPayment(price, downPct, annualRate) {
    const principal = price * (1 - downPct / 100);
    const r = annualRate / 100 / 12;
    const n = 360; // 30-year fixed
    if (r === 0) return principal / n;
    return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function calcProjection(price, downPct, annualRate, years) {
    const downPayment = price * (downPct / 100);
    const monthly = calcMonthlyPayment(price, downPct, annualRate);
    const months = years * 12;

    // Total mortgage payments made during stay
    const totalMortgagePayments = monthly * months;

    // Interest paid: track amortization
    const principal = price - downPayment;
    const r = annualRate / 100 / 12;
    let balance = principal;
    let totalInterest = 0;
    for (let i = 0; i < months; i++) {
        const interestThisMonth = balance * r;
        totalInterest += interestThisMonth;
        balance -= (monthly - interestThisMonth);
    }

    const totalCost = downPayment + totalMortgagePayments;

    return {
        downPayment: downPayment,
        monthly: monthly,
        totalInterest: totalInterest,
        totalCost: totalCost
    };
}

function fmt(num) {
    return "$" + Math.round(num).toLocaleString();
}

function runProjection() {
    const priceA = parseFloat(document.getElementById("priceA") ? document.getElementById("priceA").value : "");
    const priceB = parseFloat(document.getElementById("priceB") ? document.getElementById("priceB").value : "");
    const downPct = parseFloat(document.getElementById("downPayment").value);
    const rate = parseFloat(document.getElementById("interestRate").value);
    const years = parseInt(document.getElementById("stayYears").value);

    const resultsEl = document.getElementById("projectionResults");

    if (isNaN(priceA) || isNaN(priceB)) {
        alert("Please enter prices for both homes in the comparison section above first.");
        return;
    }
    if (isNaN(downPct) || downPct <= 0 || downPct >= 100) {
        alert("Please enter a valid down payment percentage between 1 and 99.");
        return;
    }
    if (isNaN(rate) || rate <= 0) {
        alert("Please enter a valid interest rate.");
        return;
    }

    const projA = calcProjection(priceA, downPct, rate, years);
    const projB = calcProjection(priceB, downPct, rate, years);

    const nameA = (document.getElementById("nameA") && document.getElementById("nameA").value.trim()) || "Home A";
    const nameB = (document.getElementById("nameB") && document.getElementById("nameB").value.trim()) || "Home B";

    document.getElementById("projLabelA").textContent = nameA;
    document.getElementById("projLabelB").textContent = nameB;

    document.getElementById("downA").textContent    = fmt(projA.downPayment);
    document.getElementById("monthlyA").textContent = fmt(projA.monthly) + "/mo";
    document.getElementById("interestA").textContent = fmt(projA.totalInterest);
    document.getElementById("totalA").textContent   = fmt(projA.totalCost);

    document.getElementById("downB").textContent    = fmt(projB.downPayment);
    document.getElementById("monthlyB").textContent = fmt(projB.monthly) + "/mo";
    document.getElementById("interestB").textContent = fmt(projB.totalInterest);
    document.getElementById("totalB").textContent   = fmt(projB.totalCost);

    const winner = document.getElementById("projWinner");
    const winnerNote = document.getElementById("projWinnerNote");
    const cardA = document.getElementById("projCardA");
    const cardB = document.getElementById("projCardB");

    cardA.classList.remove("proj-card-winner");
    cardB.classList.remove("proj-card-winner");

    const diff = Math.abs(projA.totalCost - projB.totalCost);

    if (projA.totalCost < projB.totalCost) {
        winner.textContent = nameA + " costs less over " + years + " years.";
        winnerNote.textContent = "You would spend " + fmt(diff) + " less on " + nameA + " over this period.";
        cardA.classList.add("proj-card-winner");
    } else if (projB.totalCost < projA.totalCost) {
        winner.textContent = nameB + " costs less over " + years + " years.";
        winnerNote.textContent = "You would spend " + fmt(diff) + " less on " + nameB + " over this period.";
        cardB.classList.add("proj-card-winner");
    } else {
        winner.textContent = "Both homes cost the same over " + years + " years.";
        winnerNote.textContent = "The total cost of ownership is identical for this scenario.";
    }

    resultsEl.classList.remove("hidden");
}