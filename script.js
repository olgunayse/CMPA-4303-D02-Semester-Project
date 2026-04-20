function runComparison() {
    const priority = document.getElementById('prioritySelect').value;
    const output = document.getElementById('comparisonResult');
    const note = document.getElementById('tradeOffText');

    const analysis = {
        price: { result: "Home A is the strategic financial choice.", note: "A savings of $50,000 provides significant capital for future equity growth." },
        space: { result: "Home A offers greater volume.", note: "With 2,000 sq ft, you gain 500 sq ft of additional space, ideal for long-term comfort." },
        location: { result: "Home B offers superior urban positioning.", note: "You are investing in location and lifestyle efficiency over square footage." },
        balance: { result: "A study in trade-offs.", note: "Home A prioritizes foundational value; Home B prioritizes location and prestige." }
    };

    const data = analysis[priority];
    output.innerHTML = `<em>${data.result}</em>`;
    note.textContent = data.note;
}