function openPopup(id) {
    document.getElementById(id).style.display = "flex";
}

function closePopup(id) {
    document.getElementById(id).style.display = "none";
}

function clearHighlight() {
    const homeA = document.getElementById("homeA");
    const homeB = document.getElementById("homeB");

    if (homeA) {
        homeA.classList.remove("active-home");
    }

    if (homeB) {
        homeB.classList.remove("active-home");
    }
}

function runComparison() {
    const priority = document.getElementById("prioritySelect").value;
    const result = document.getElementById("comparisonResult");
    const tradeOffText = document.getElementById("tradeOffText");
    const homeA = document.getElementById("homeA");
    const homeB = document.getElementById("homeB");

    clearHighlight();

    if (priority === "price") {
        result.innerHTML = "<strong>Result:</strong> Home A may be the better fit for a buyer who wants a lower price.";
        tradeOffText.textContent = "Home A stands out because it gives the buyer more space while also costing less.";
        homeA.classList.add("active-home");
    } else if (priority === "space") {
        result.innerHTML = "<strong>Result:</strong> Home A may be the better fit for a buyer who wants more space.";
        tradeOffText.textContent = "Home A offers more square footage, so it may work better for someone who values room and flexibility.";
        homeA.classList.add("active-home");
    } else if (priority === "location") {
        result.innerHTML = "<strong>Result:</strong> Home B may be the better fit for a buyer who cares most about location.";
        tradeOffText.textContent = "Home B stands out because it offers a stronger city location, even though it costs more and gives less space.";
        homeB.classList.add("active-home");
    } else if (priority === "balance") {
        result.innerHTML = "<strong>Result:</strong> Both homes offer different strengths, so the better choice depends on the buyer's overall priorities.";
        tradeOffText.textContent = "Home A is stronger in price and space, while Home B is stronger in location. A balanced choice depends on which trade off feels more important.";
    }
}

window.addEventListener("click", function (event) {
    const projectPopup = document.getElementById("projectPopup");
    const interactivePopup = document.getElementById("interactivePopup");

    if (event.target === projectPopup) {
        projectPopup.style.display = "none";
    }

    if (event.target === interactivePopup) {
        interactivePopup.style.display = "none";
    }
});