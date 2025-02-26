const fs = require('fs');

// Create sample logs
const generateSampleLogs = () => {
    const logs = [];
    // Generate logs for 3 days
    for (let day = 1; day <= 3; day++) {
        // Generate 5 logs per day
        for (let i = 1; i <= 5; i++) {
            const date = `2024-03-${day.toString().padStart(2, '0')}`;
            logs.push(`${date} 10:${i.toString().padStart(2, '0')}:00 INFO Sample log entry ${i} for ${date}`);
        }
    }
    return logs.join('\n');
};

// Create sample_logs.txt
fs.writeFileSync('sample_logs.txt', generateSampleLogs());
console.log('Sample logs created in sample_logs.txt'); 