function clearActiveCards() {
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

    clearActiveCards();

    if (priority === "budget") {
        result.textContent = "Comparison result: Home A stands out more for buyers focused on a lower price.";
        tradeOffText.textContent = "Home A may appeal more to budget-conscious buyers because it offers a lower purchase price while still providing more space.";
        homeA.classList.add("active-card");
    } else if (priority === "space") {
        result.textContent = "Comparison result: Home A stands out more for buyers who want more square footage.";
        tradeOffText.textContent = "Home A gives the buyer more interior space, which may be more useful for families or anyone who values room over location.";
        homeA.classList.add("active-card");
    } else if (priority === "location") {
        result.textContent = "Comparison result: Home B stands out more for buyers who care most about location.";
        tradeOffText.textContent = "Home B may be the stronger option for buyers who prioritize convenience, access, and being closer to city amenities.";
        homeB.classList.add("active-card");
    } else if (priority === "balance") {
        result.textContent = "Comparison result: Both homes offer different advantages, so the better fit depends on whether the buyer values cost and space more than location.";
        tradeOffText.textContent = "Home A offers better price and size, while Home B offers better location. The decision depends on which trade off feels more worthwhile to the buyer.";
    }
}

function resetComparison() {
    const result = document.getElementById("comparisonResult");
    const tradeOffText = document.getElementById("tradeOffText");
    const priority = document.getElementById("prioritySelect");

    clearActiveCards();

    priority.value = "budget";
    result.textContent = "Select a buyer priority, then click Compare Homes.";
    tradeOffText.textContent = "Home A offers more square footage for a lower price, while Home B offers a more convenient location but less space. This makes the decision less about which home is better overall and more about what matters more to the buyer.";
}

document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");
    const searchResult = document.getElementById("searchResult");

    if (searchButton && searchInput && searchResult) {
        searchButton.addEventListener("click", function () {
            const input = searchInput.value.toLowerCase().trim();

            if (input.includes("city") || input.includes("location")) {
                searchResult.textContent = "Search result: Buyers focused on location may prefer Home B.";
            } else if (input.includes("space") || input.includes("large") || input.includes("size")) {
                searchResult.textContent = "Search result: Buyers focused on more space may prefer Home A.";
            } else if (input.includes("budget") || input.includes("price") || input.includes("cheap")) {
                searchResult.textContent = "Search result: Buyers focused on price may prefer Home A.";
            } else if (input === "") {
                searchResult.textContent = "Please type a city, price, or feature first.";
            } else {
                searchResult.textContent = "Try searching with words like location, price, city, or space.";
            }
        });
    }
});