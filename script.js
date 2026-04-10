function selectPriority(button, priority) {
    const buttons = document.querySelectorAll(".priority-buttons button");
    const result = document.getElementById("comparisonResult");
    const homeA = document.getElementById("homeA");
    const homeB = document.getElementById("homeB");

    // reset buttons
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    // reset cards
    homeA.classList.remove("active-card");
    homeB.classList.remove("active-card");

    // logic
    if (priority === "budget") {
        result.textContent = "Home A is better for buyers focused on a lower price.";
        homeA.classList.add("active-card");
    } else if (priority === "space") {
        result.textContent = "Home A is better for buyers who want more space.";
        homeA.classList.add("active-card");
    } else if (priority === "location") {
        result.textContent = "Home B is better for buyers who prioritize location.";
        homeB.classList.add("active-card");
    } else if (priority === "balance") {
        result.textContent = "Both homes offer different strengths depending on the buyer.";
    }
}