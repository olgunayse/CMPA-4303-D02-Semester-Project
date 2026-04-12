function clearHighlight() {
    const homeA = document.getElementById("homeA");
    const homeB = document.getElementById("homeB");

    homeA.classList.remove("highlight");
    homeB.classList.remove("highlight");
}

function runComparison() {
    const priority = document.getElementById("prioritySelect").value;
    const result = document.getElementById("comparisonResult");
    const tradeOffText = document.getElementById("tradeOffText");
    const homeA = document.getElementById("homeA");
    const homeB = document.getElementById("homeB");

    clearHighlight();

    if (priority === "price") {
        result.textContent = "Home A may be the better fit for a buyer who wants a lower price.";
        tradeOffText.textContent = "Home A costs less and also offers more space.";
        homeA.classList.add("highlight");
    } else if (priority === "space") {
        result.textContent = "Home A may be the better fit for a buyer who wants more space.";
        tradeOffText.textContent = "Home A offers more square footage than Home B.";
        homeA.classList.add("highlight");
    } else if (priority === "location") {
        result.textContent = "Home B may be the better fit for a buyer who cares most about location.";
        tradeOffText.textContent = "Home B offers a stronger city location, even though it has less space and a higher price.";
        homeB.classList.add("highlight");
    } else if (priority === "balance") {
        result.textContent = "Both homes offer different strengths depending on what the buyer values more.";
        tradeOffText.textContent = "Home A is stronger in price and space, while Home B is stronger in location.";
    }
}