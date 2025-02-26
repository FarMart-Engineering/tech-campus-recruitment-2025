const fs = require('fs');
const path = require('path');
const readline = require('readline');

class LogExtractor {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async createOutputDirectory() {
        await fs.promises.mkdir('output', { recursive: true });
    }

    extractDateFromLine(line) {
        try {
            return line.substring(0, 10); // Extract YYYY-MM-DD
        } catch {
            return null;
        }
    }

    validateDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
    }

    async extractLogs(targetDate) {
        if (!this.validateDate(targetDate)) {
            throw new Error('Invalid date format. Please use YYYY-MM-DD');
        }

        await this.createOutputDirectory();
        const outputFile = path.join('output', `output_${targetDate}.txt`);

        const readStream = fs.createReadStream(this.filePath, {
            encoding: 'utf8'
        });

        const writeStream = fs.createWriteStream(outputFile);
        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity
        });

        let matchCount = 0;

        for await (const line of rl) {
            const currentDate = this.extractDateFromLine(line);
            
            if (currentDate === targetDate) {
                writeStream.write(line + '\n');
                matchCount++;
            }
        }

        writeStream.end();
        return { outputFile, matchCount };
    }
}

async function main() {
    if (process.argv.length !== 3) {
        console.error('Usage: node extract_logs.js YYYY-MM-DD');
        process.exit(1);
    }

    const targetDate = process.argv[2];
    const logFile = 'sample_logs.txt';
    
    try {
        const extractor = new LogExtractor(logFile);
        const { outputFile, matchCount } = await extractor.extractLogs(targetDate);
        console.log(`Found ${matchCount} logs for ${targetDate}`);
        console.log(`Logs extracted to ${outputFile}`);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main(); 