function clearHighlights() {
    const homeA = document.getElementById("homeA");
    const homeB = document.getElementById("homeB");

    if (homeA) {
        homeA.classList.remove("active-card");
    }

    if (homeB) {
        homeB.classList.remove("active-card");
    }
}

function runComparison() {
    const priority = document.getElementById("prioritySelect").value;
    const result = document.getElementById("comparisonResult");
    const tradeOffText = document.getElementById("tradeOffText");
    const homeA = document.getElementById("homeA");
    const homeB = document.getElementById("homeB");

    clearHighlights();

    if (priority === "price") {
        result.textContent = "Result: Home A may be the better fit for a buyer who wants a lower price.";
        tradeOffText.textContent = "Home A stands out because it offers a lower purchase price while still giving the buyer more space.";
        homeA.classList.add("active-card");
    } else if (priority === "space") {
        result.textContent = "Result: Home A may be the better fit for a buyer who wants more space.";
        tradeOffText.textContent = "Home A offers more square footage, which may be more useful for buyers who value room and flexibility.";
        homeA.classList.add("active-card");
    } else if (priority === "location") {
        result.textContent = "Result: Home B may be the better fit for a buyer who cares most about location.";
        tradeOffText.textContent = "Home B stands out because it offers a stronger city location, even though it has less space and a higher price.";
        homeB.classList.add("active-card");
    } else if (priority === "balance") {
        result.textContent = "Result: Both homes offer different strengths, so the better choice depends on the buyer's overall priorities.";
        tradeOffText.textContent = "Home A is stronger in price and space, while Home B is stronger in location. A balanced decision depends on what the buyer values more.";
    }
}