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

    
    if (!lastUpdateDate) {
        return {
            shouldUpdate: true,
            newAmount: 0,
            newDate: today
        };
    }

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastMonth = lastUpdateDate.getMonth();
    const lastYear = lastUpdateDate.getFullYear();

    let monthsPassed = (currentYear - lastYear) * 12 + (currentMonth - lastMonth);

    const currentDay = today.getDate();
    const lastDay = lastUpdateDate.getDate();

    if (monthsPassed === 0 && currentDay < allowanceDate) {
        return { shouldUpdate: false };
    }

    if (monthsPassed === 0 && currentDay >= allowanceDate && lastDay < allowanceDate) {
        monthsPassed = 1;
    }

    if (monthsPassed > 0) {
        return {
            shouldUpdate: true,
            monthsPassed,
            newDate: today
        };
    }

    return { shouldUpdate: false };
};

export const getCurrentSavings = (savingsHistory) => {
    if (!savingsHistory || savingsHistory.length === 0) return 0;
    return savingsHistory[savingsHistory.length - 1].amount || 0;
};


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
