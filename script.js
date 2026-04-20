function runComparison() {
    let priority = document.getElementById("prioritySelect").value;
    let result = document.getElementById("comparisonResult");

    if (priority === "price") {
        result.innerText = "Home A is better because it is cheaper.";
    } else if (priority === "space") {
        result.innerText = "Home A is better because it has more space.";
    } else if (priority === "location") {
        result.innerText = "Home B is better because of its location.";
    }
}