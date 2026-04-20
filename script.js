function runComparison() {
    // Get the user's selection
    const priority = document.getElementById('prioritySelect').value;
    const resultElement = document.getElementById('comparisonResult');
    const tradeOffElement = document.getElementById('tradeOffText');

    // Update the result based on user selection
    if (priority === 'price') {
        resultElement.innerHTML = 'Based on <strong>price</strong>, Home A is the better choice ($300k vs $350k).';
        tradeOffElement.textContent = 'Home A saves you $50,000, though it is located in the suburbs.';
    } else if (priority === 'space') {
        resultElement.innerHTML = 'Based on <strong>space</strong>, Home A is the winner with 2,000 sq ft.';
        tradeOffElement.textContent = 'Home A gives you an extra 500 square feet compared to Home B.';
    } else if (priority === 'location') {
        resultElement.innerHTML = 'Based on <strong>location</strong>, Home B is the clear winner.';
        tradeOffElement.textContent = 'Home B places you in the city, which is ideal for convenience, despite the smaller size.';
    } else {
        resultElement.innerHTML = 'Based on <strong>overall balance</strong>, both homes have distinct advantages.';
        tradeOffElement.textContent = 'Home A prioritizes budget and space, while Home B prioritizes location and lifestyle.';
    }
}