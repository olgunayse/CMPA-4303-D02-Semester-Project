function runComparison() {
    const priority = document.getElementById('prioritySelect').value;
    const output = document.getElementById('comparisonResult');
    const note = document.getElementById('tradeOffText');

    const findings = {
        price: { 
            result: "Home A is the stronger financial choice.", 
            note: "It preserves $50k in capital compared to Home B, allowing for potential renovations." 
        },
        space: { 
            result: "Home A wins on volume.", 
            note: "With 2,000 sq ft, you're getting 500 sq ft of additional usable space." 
        },
        location: { 
            result: "Home B offers superior positioning.", 
            note: "You're trading square footage for the convenience of being in the city core." 
        },
        balance: { 
            result: "This is a trade-off between value and lifestyle.", 
            note: "Home A is a standard suburban value play; Home B is a premium location play." 
        }
    };

    const data = findings[priority];
    output.innerHTML = `<strong>${data.result}</strong>`;
    note.textContent = data.note;
}