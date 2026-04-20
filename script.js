function runComparison() {
    const priority = document.getElementById('prioritySelect').value;
    const output = document.getElementById('comparisonResult');
    const note = document.getElementById('tradeOffText');

    const analysis = {
        price: { result: "Home A is the financial play.", note: "You save $50,000 upfront. This is capital that could be used for immediate upgrades." },
        space: { result: "Home A maximizes your footprint.", note: "At 2,000 sq ft, you gain 500 sq ft over Home B. This is ideal if you value room to grow." },
        location: { result: "Home B wins on location.", note: "You pay a premium for the city, but save on time and travel costs. Lifestyle choice." },
        balance: { result: "The trade-off: Suburb vs. City.", note: "Home A is for the long-term value seeker; Home B is for the urban-centric buyer." }
    };

    const data = analysis[priority];
    output.innerHTML = `<strong>${data.result}</strong>`;
    note.textContent = data.note;
}