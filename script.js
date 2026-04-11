const scenarios = {
    lifestyle: {
        p1: { name: "City Loft", price: "$620k", location: 95, space: 30, convenience: 90 },
        p2: { name: "Suburban Colonial", price: "$595k", location: 40, space: 95, convenience: 50 },
        take: "In this scenario, the client is trading **Living Space** for **Time**. The City Loft saves roughly 10 hours a week in commuting, which is why the price per square foot is doubled."
    },
    investment: {
        p1: { name: "As-Is Fixer", price: "$320k", location: 70, space: 60, convenience: 10 },
        p2: { name: "Renovated Ranch", price: "$485k", location: 70, space: 60, convenience: 100 },
        take: "The 'Fixer' offers instant equity potential. The trade-off is **Liquid Cash vs. Monthly Payment**. A renovated home allows the client to finance the 'newness' over 30 years."
    }
};

function updateDashboard(type) {
    const data = scenarios[type];
    const grid = document.getElementById('property-grid');
    const logic = document.getElementById('logic-box');

    // Create the visual cards
    grid.innerHTML = [data.p1, data.p2].map(p => `
        <div class="property-card">
            <h2>${p.name}</h2>
            <p><strong>List Price:</strong> ${p.price}</p>
            <div class="stat-row">
                <div class="stat-label"><span>Location/Walkability</span><span>${p.location}%</span></div>
                <div class="stat-bar"><div class="stat-fill" style="width: ${p.location}%"></div></div>
            </div>
            <div class="stat-row">
                <div class="stat-label"><span>Interior Space</span><span>${p.space}%</span></div>
                <div class="stat-bar"><div class="stat-fill" style="width: ${p.space}%"></div></div>
            </div>
            <div class="stat-row">
                <div class="stat-label"><span>Move-in Ready</span><span>${p.convenience}%</span></div>
                <div class="stat-bar"><div class="stat-fill" style="width: ${p.convenience}%"></div></div>
            </div>
        </div>
    `).join('');

    // Update the Smarter Take
    logic.innerHTML = `
        <h3>The Smarter Take</h3>
        <p>${data.take}</p>
    `;
}
