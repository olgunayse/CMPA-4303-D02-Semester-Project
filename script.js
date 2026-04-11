const propertyData = {
    city: {
        h1: "City Luxury Condo",
        h2: "Suburban Family Home",
        price1: "$550,000",
        price2: "$525,000",
        size1: "950 sq ft",
        size2: "2,400 sq ft",
        loc1: "Walk to Work/Dining",
        loc2: "30-min Commute",
        logic: "In the city, you are paying for **Location & Lifestyle**. In the suburbs, you are paying for **Space & Privacy**.",
        buyer: "Best for: High-earning singles or couples who value time over square footage."
    },
    renovated: {
        h1: "The 'Fixer Upper'",
        h2: "The 'Turn-Key' Home",
        price1: "$350,000",
        price2: "$475,000",
        size1: "Same",
        size2: "Same",
        loc1: "Established Area",
        loc2: "Same Area",
        logic: "The Fixer Upper saves you $125k upfront, but requires 'Sweat Equity'. The Turn-Key costs more but rolls the renovation costs into a low-interest mortgage.",
        buyer: "Best for: Buyers with cash reserves vs. Buyers who want a predictable monthly payment."
    }
};

function compareProperties(type) {
    const display = document.getElementById('comparison-display');
    const item = propertyData[type];

    display.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Feature</th>
                    <th>${item.h1}</th>
                    <th>${item.h2}</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Price</td><td>${item.price1}</td><td>${item.price2}</td></tr>
                <tr><td>Size</td><td>${item.size1}</td><td>${item.size2}</td></tr>
                <tr><td>Location</td><td>${item.loc1}</td><td>${item.loc2}</td></tr>
            </tbody>
        </table>
        <div class="tradeoff-summary">
            <h3>The Smarter Take:</h3>
            <p>${item.logic}</p>
            <p><em>${item.buyer}</em></p>
        </div>
    `;
}
