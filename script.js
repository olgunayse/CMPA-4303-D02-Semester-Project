function setPreview(type) {
    const text = document.getElementById("previewText");

    if (!text) {
        return;
    }

    const messages = {
        price: "Lower price increases flexibility and long-term financial stability.",
        space: "More space improves comfort and long-term usability.",
        location: "Better location enhances lifestyle and resale value.",
        balance: "Balanced decisions consider cost, livability, and overall lifestyle fit together."
    };

    text.textContent = messages[type];
}

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
        } else {
            resultText = "Both homes are equally strong on price.";
            noteText = "Price does not separate these options, so space and location become more important.";
            buyerText = "Best for: buyer who wants to compare based on non-price priorities.";
            confidence = "Confidence is moderate because the homes are tied on the selected priority.";
        }
    } else if (priority === "space") {
        if (spaceA > spaceB) {
            resultText = "Home A is the stronger space-focused choice.";
            noteText = "It offers more room for comfort, flexibility, and long-term livability.";
            buyerText = "Best for: growing family or long-term owner.";
            confidence = Math.abs(spaceA - spaceB) >= 300
                ? "This is a strong recommendation based on a noticeable space advantage."
                : "This recommendation is moderate because the size difference is relatively small.";
            winningHome = "A";
        } else if (spaceB > spaceA) {
            resultText = "Home B is the stronger space-focused choice.";
            noteText = "It offers more room for comfort, flexibility, and long-term livability.";
            buyerText = "Best for: growing family or long-term owner.";
            confidence = Math.abs(spaceA - spaceB) >= 300
                ? "This is a strong recommendation based on a noticeable space advantage."
                : "This recommendation is moderate because the size difference is relatively small.";
            winningHome = "B";
        } else {
            resultText = "Both homes are equally strong on space.";
            noteText = "Square footage does not separate these options, so price and location matter more.";
            buyerText = "Best for: buyer who values layout, cost, and location more than raw square footage.";
            confidence = "Confidence is moderate because the homes are tied on the selected priority.";
        }
    } else if (priority === "location") {
        if (locationA > locationB) {
            resultText = "Home A is the stronger location-focused choice.";
            noteText = "It appears to offer stronger positioning, convenience, and lifestyle value.";
            buyerText = "Best for: lifestyle-focused buyer or future resale-minded buyer.";
            confidence = Math.abs(locationA - locationB) >= 2
                ? "This is a strong recommendation based on a clear location advantage."
                : "This recommendation is moderate because the location scores are fairly close.";
            winningHome = "A";
        } else if (locationB > locationA) {
            resultText = "Home B is the stronger location-focused choice.";
            noteText = "It appears to offer stronger positioning, convenience, and lifestyle value.";
            buyerText = "Best for: lifestyle-focused buyer or future resale-minded buyer.";
            confidence = Math.abs(locationA - locationB) >= 2
                ? "This is a strong recommendation based on a clear location advantage."
                : "This recommendation is moderate because the location scores are fairly close.";
            winningHome = "B";
        } else {
            resultText = "Both homes are equally strong on location.";
            noteText = "Location does not separate these options, so price and space carry more weight.";
            buyerText = "Best for: buyer who wants to compare based on affordability or size.";
            confidence = "Confidence is moderate because the homes are tied on the selected priority.";
        }
    } else {
        const scoreA = (locationA * 10) + spaceA - (priceA / 1000);
        const scoreB = (locationB * 10) + spaceB - (priceB / 1000);

        if (scoreA > scoreB) {
            resultText = "Home A offers the stronger overall balance.";
            noteText = "It presents the better blend of cost, space, and location based on the entered values.";
            buyerText = "Best for: practical buyer seeking overall value.";
            confidence = Math.abs(scoreA - scoreB) >= 20
                ? "This is a strong recommendation because one home shows a clearer overall advantage."
                : "This recommendation is moderate because both homes are fairly competitive overall.";
            winningHome = "A";
        } else if (scoreB > scoreA) {
            resultText = "Home B offers the stronger overall balance.";
            noteText = "It presents the better blend of cost, space, and location based on the entered values.";
            buyerText = "Best for: practical buyer seeking overall value.";
            confidence = Math.abs(scoreA - scoreB) >= 20
                ? "This is a strong recommendation because one home shows a clearer overall advantage."
                : "This recommendation is moderate because both homes are fairly competitive overall.";
            winningHome = "B";
        } else {
            resultText = "Both homes offer a very similar overall balance.";
            noteText = "This decision likely depends on personal preferences and buyer lifestyle.";
            buyerText = "Best for: buyer who wants to look deeper at personal priorities before choosing.";
            confidence = "Confidence is moderate because the homes perform similarly across the main factors.";
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

function resetForm() {
    const inputs = document.querySelectorAll("input");
    const summaryList = document.getElementById("summaryList");
    const result = document.getElementById("comparisonResult");
    const note = document.getElementById("tradeOffText");
    const buyerType = document.getElementById("buyerType");
    const confidenceText = document.getElementById("confidenceText");
    const prioritySelect = document.getElementById("prioritySelect");
    const homeA = document.getElementById("homeA");
    const homeB = document.getElementById("homeB");

    inputs.forEach(function(input) {
        input.value = "";
    });

    if (prioritySelect) {
        prioritySelect.value = "price";
    }

    if (result) {
        result.textContent = "Enter values to begin analysis.";
    }

    if (note) {
        note.textContent = "";
    }

    if (buyerType) {
        buyerType.textContent = "No buyer profile yet.";
    }

    if (confidenceText) {
        confidenceText.textContent = "Confidence statement will appear here.";
    }

    if (summaryList) {
        summaryList.innerHTML = "<li>Home A and Home B have not been compared yet.</li>";
    }

    if (homeA) {
        homeA.classList.remove("winner");
    }

    if (homeB) {
        homeB.classList.remove("winner");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const liveFields = document.querySelectorAll("#priceA, #priceB, #spaceA, #spaceB, #locationA, #locationB, #prioritySelect");

    liveFields.forEach(function(field) {
        field.addEventListener("input", runComparison);
        field.addEventListener("change", runComparison);
    });
});