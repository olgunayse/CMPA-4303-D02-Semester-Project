// ===== HOMEPAGE PREVIEW INTERACTION =====
function setPreview(type, element) {
    const text = document.getElementById("previewText");
    const options = document.querySelectorAll(".options span");

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
}

// ===== COMPARISON TOOL =====
function runComparison() {
    const priceAField = document.getElementById("priceA");
    const priceBField = document.getElementById("priceB");
    const spaceAField = document.getElementById("spaceA");
    const spaceBField = document.getElementById("spaceB");
    const locationAField = document.getElementById("locationA");
    const locationBField = document.getElementById("locationB");
    const priorityField = document.getElementById("prioritySelect");

    if (!priceAField || !priceBField || !spaceAField || !spaceBField || !locationAField || !locationBField || !priorityField) {
        return;
    }

    const priceA = parseFloat(priceAField.value);
    const priceB = parseFloat(priceBField.value);
    const spaceA = parseFloat(spaceAField.value);
    const spaceB = parseFloat(spaceBField.value);
    const locationA = parseFloat(locationAField.value);
    const locationB = parseFloat(locationBField.value);
    const priority = priorityField.value;

    const result = document.getElementById("comparisonResult");
    const note = document.getElementById("tradeOffText");
    const buyerType = document.getElementById("buyerType");
    const confidenceText = document.getElementById("confidenceText");
    const summaryList = document.getElementById("summaryList");
    const homeA = document.getElementById("homeA");
    const homeB = document.getElementById("homeB");

    if (!result || !note || !buyerType || !confidenceText || !summaryList || !homeA || !homeB) {
        return;
    }

    homeA.classList.remove("winner");
    homeB.classList.remove("winner");

    if (
        isNaN(priceA) || isNaN(priceB) ||
        isNaN(spaceA) || isNaN(spaceB) ||
        isNaN(locationA) || isNaN(locationB)
    ) {
        result.textContent = "Please fill in all fields.";
        note.textContent = "";
        buyerType.textContent = "No buyer profile yet.";
        confidenceText.textContent = "Confidence statement will appear here.";
        summaryList.innerHTML = "<li>Home A and Home B have not been compared yet.</li>";
        return;
    }

    let resultText = "";
    let noteText = "";
    let buyerText = "";
    let confidence = "";
    let winningHome = "";

    const summaryItems = [];

    // SUMMARY
    if (priceA < priceB) {
        summaryItems.push("Home A offers the stronger price advantage.");
    } else if (priceB < priceA) {
        summaryItems.push("Home B offers the stronger price advantage.");
    } else {
        summaryItems.push("Both homes are equal in price.");
    }

    if (spaceA > spaceB) {
        summaryItems.push("Home A provides more interior space.");
    } else if (spaceB > spaceA) {
        summaryItems.push("Home B provides more interior space.");
    } else {
        summaryItems.push("Both homes offer the same amount of space.");
    }

    if (locationA > locationB) {
        summaryItems.push("Home A has the stronger location score.");
    } else if (locationB > locationA) {
        summaryItems.push("Home B has the stronger location score.");
    } else {
        summaryItems.push("Both homes have the same location score.");
    }

    // LOGIC
    if (priority === "price") {
        if (priceA < priceB) {
            resultText = "Home A is the stronger price-focused choice.";
            noteText = "It offers a lower entry point and greater financial flexibility.";
            buyerText = "Best for: first-time buyer or budget-conscious buyer.";
            confidence = Math.abs(priceA - priceB) >= 25000
                ? "This is a strong recommendation based on a meaningful price difference."
                : "This recommendation is moderate because the pricing difference is present but not dramatic.";
            winningHome = "A";
        } else if (priceB < priceA) {
            resultText = "Home B is the stronger price-focused choice.";
            noteText = "It offers a lower entry point and greater financial flexibility.";
            buyerText = "Best for: first-time buyer or budget-conscious buyer.";
            confidence = Math.abs(priceA - priceB) >= 25000
                ? "This is a strong recommendation based on a meaningful price difference."
                : "This recommendation is moderate because the pricing difference is present but not dramatic.";
            winningHome = "B";
        }
    } else if (priority === "space") {
        if (spaceA > spaceB) {
            resultText = "Home A is the stronger space-focused choice.";
            noteText = "It offers more room for comfort and long term livability.";
            buyerText = "Best for: growing family or long term owner.";
            winningHome = "A";
        } else if (spaceB > spaceA) {
            resultText = "Home B is the stronger space-focused choice.";
            noteText = "It offers more room for comfort and long term livability.";
            buyerText = "Best for: growing family or long term owner.";
            winningHome = "B";
        }
    } else if (priority === "location") {
        if (locationA > locationB) {
            resultText = "Home A is the stronger location-focused choice.";
            noteText = "It offers better positioning and lifestyle value.";
            buyerText = "Best for: lifestyle-focused buyer.";
            winningHome = "A";
        } else if (locationB > locationA) {
            resultText = "Home B is the stronger location-focused choice.";
            noteText = "It offers better positioning and lifestyle value.";
            buyerText = "Best for: lifestyle-focused buyer.";
            winningHome = "B";
        }
    } else {
        const scoreA = (locationA * 10) + spaceA - (priceA / 1000);
        const scoreB = (locationB * 10) + spaceB - (priceB / 1000);

        if (scoreA > scoreB) {
            resultText = "Home A offers the stronger overall balance.";
            noteText = "Better mix of cost, space, and location.";
            buyerText = "Best for: practical buyer.";
            winningHome = "A";
        } else if (scoreB > scoreA) {
            resultText = "Home B offers the stronger overall balance.";
            noteText = "Better mix of cost, space, and location.";
            buyerText = "Best for: practical buyer.";
            winningHome = "B";
        }
    }

    result.textContent = resultText;
    note.textContent = noteText;
    buyerType.textContent = buyerText;
    confidenceText.textContent = confidence;

    summaryList.innerHTML = "";
    summaryItems.forEach(function(item) {
        const li = document.createElement("li");
        li.textContent = item;
        summaryList.appendChild(li);
    });

    if (winningHome === "A") {
        homeA.classList.add("winner");
    } else if (winningHome === "B") {
        homeB.classList.add("winner");
    }
}

// ===== RESET =====
function resetForm() {
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => input.value = "");

    document.getElementById("comparisonResult").textContent = "Enter values to begin analysis.";
    document.getElementById("tradeOffText").textContent = "";
    document.getElementById("buyerType").textContent = "No buyer profile yet.";
    document.getElementById("confidenceText").textContent = "Confidence statement will appear here.";
    document.getElementById("summaryList").innerHTML = "<li>Home A and Home B have not been compared yet.</li>";

    document.getElementById("homeA").classList.remove("winner");
    document.getElementById("homeB").classList.remove("winner");
}

// ===== PAGE LOAD =====
document.addEventListener("DOMContentLoaded", function() {

    // Auto-select preview option
    const first = document.querySelector(".options span");
    if (first) {
        first.click();
    }

    // Live comparison updates
    const liveFields = document.querySelectorAll("#priceA, #priceB, #spaceA, #spaceB, #locationA, #locationB, #prioritySelect");

    liveFields.forEach(function(field) {
        field.addEventListener("input", runComparison);
        field.addEventListener("change", runComparison);
    });

});