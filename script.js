function setPreview(type) {
    const text = document.getElementById("previewText");

    const messages = {
        price: "Lower price increases flexibility and long-term financial stability.",
        space: "More space improves comfort and long-term usability.",
        location: "Better location enhances lifestyle and resale value."
    };

    text.textContent = messages[type];
}

function runComparison() {
    const priceA = parseFloat(document.getElementById("priceA").value);
    const priceB = parseFloat(document.getElementById("priceB").value);
    const spaceA = parseFloat(document.getElementById("spaceA").value);
    const spaceB = parseFloat(document.getElementById("spaceB").value);
    const priority = document.getElementById("prioritySelect").value;

    const result = document.getElementById("comparisonResult");
    const note = document.getElementById("tradeOffText");

    if (!priceA || !priceB || !spaceA || !spaceB) {
        result.textContent = "Please fill in all fields.";
        note.textContent = "";
        return;
    }

    if (priority === "price") {
        result.textContent = priceA < priceB ? "Home A is more affordable." : "Home B is more affordable.";
        note.textContent = "Lower cost provides more financial flexibility.";
    } 
    else if (priority === "space") {
        result.textContent = spaceA > spaceB ? "Home A offers more space." : "Home B offers more space.";
        note.textContent = "More space improves long-term comfort.";
    } 
    else {
        result.textContent = "Each home offers different advantages.";
        note.textContent = "Your final decision depends on balancing cost and space.";
    }
}