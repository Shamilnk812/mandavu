



const generateAmPmTimes = () => {
    const times = [];
    const startHour = 9; // Starting at 9 AM
    const endHour = 21; // Ending at 9 PM (24-hour format for easier calculation)

    for (let hour = startHour; hour <= endHour; hour++) {
        const isPm = hour >= 12;
        const formattedHour = hour > 12 ? hour - 12 : hour; // Convert 13-23 to 1-11
        const period = isPm ? "PM" : "AM";
        times.push(`${formattedHour}:00 ${period}`);
    }

    return times;
};

export default generateAmPmTimes;