/**
 * Calculate if savings should be updated based on allowance date
 * @param {Date} lastUpdate - Last time savings were updated
 * @param {Number} allowanceDate - Day of month (1-31)
 * @param {Number} monthlySavings - Amount to save each month
 * @returns {Object} - { shouldUpdate, newAmount, newDate }
 */
export const calculateSavingsUpdate = (lastUpdate, allowanceDate, monthlySavings) => {
    const today = new Date();
    const lastUpdateDate = lastUpdate ? new Date(lastUpdate) : null;

    // If no last update, this is the first time
    if (!lastUpdateDate) {
        return {
            shouldUpdate: true,
            newAmount: 0, // Start at 0
            newDate: today
        };
    }

    // Check if we've passed the allowance date since last update
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastMonth = lastUpdateDate.getMonth();
    const lastYear = lastUpdateDate.getFullYear();

    // Calculate how many months have passed
    let monthsPassed = (currentYear - lastYear) * 12 + (currentMonth - lastMonth);

    // Check if we've passed the allowance day this month
    const currentDay = today.getDate();
    const lastDay = lastUpdateDate.getDate();

    // If we're in the same month and haven't reached the allowance date yet
    if (monthsPassed === 0 && currentDay < allowanceDate) {
        return { shouldUpdate: false };
    }

    // If we're in the same month but have passed the allowance date
    if (monthsPassed === 0 && currentDay >= allowanceDate && lastDay < allowanceDate) {
        monthsPassed = 1;
    }

    // If months have passed, calculate new savings
    if (monthsPassed > 0) {
        return {
            shouldUpdate: true,
            monthsPassed,
            newDate: today
        };
    }

    return { shouldUpdate: false };
};

/**
 * Get current total savings from history
 */
export const getCurrentSavings = (savingsHistory) => {
    if (!savingsHistory || savingsHistory.length === 0) return 0;
    return savingsHistory[savingsHistory.length - 1].amount || 0;
};

/**
 * Generate projected savings data for chart
 */
export const generateProjectedSavings = (monthlySavings, months = 6) => {
    const projections = [];
    const today = new Date();

    for (let i = 0; i <= months; i++) {
        const date = new Date(today);
        date.setMonth(date.getMonth() + i);
        projections.push({
            date: date,
            amount: monthlySavings * i
        });
    }

    return projections;
};
