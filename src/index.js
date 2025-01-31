const fs = require('fs');
const readline = require('readline');
const https = require('https');
const path = require('path');

const LOG_FILE_PATH = path.join(__dirname, 'test_logs.log');
const OUTPUT_DIR = path.join(__dirname, '../output');
const LOG_FILE_URL = "https://limewire.com/d/90794bb3-6831-4e02-8a59-ffc7f3b8b2a3#X1xnzrH5s4H_DKEkT_dfBuUT1mFKZuj4cFWNoMJGX98";


//fucniton to download the fule for future prevention and overwriitern
async function downloadLogFile() {
    if (fs.existsSync(LOG_FILE_PATH)) {
        console.log("Log file already exists.");
        return;
    }

    console.log("Downloading log file...");
    const file = fs.createWriteStream(LOG_FILE_PATH);
    return new Promise((resolve, reject) => {
        https.get(LOG_FILE_URL, (response) => {
            if (response.statusCode !== 200) {
                console.error(`Failed to download log file. HTTP Status: ${response.statusCode}`);
                reject(new Error("Download failed"));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log("Download complete.");
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(LOG_FILE_PATH, () => {});
            console.error("Error downloading file:", err.message);
            reject(err);
        });
    });
}

async function extractLogs(date) {
    if (!fs.existsSync(LOG_FILE_PATH)) {
        console.error("Log file not found. Please ensure it is downloaded.");
        return;
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const outputFilePath = path.join(OUTPUT_DIR, `output_${date}.txt`);
    if (fs.existsSync(outputFilePath)) {
        console.log(`Output file for ${date} already exists. Overwrite? (y/n)`);
        const userInput = await new Promise(resolve => {
            process.stdin.once('data', data => resolve(data.toString().trim().toLowerCase()));
        });
        //type for y for download
        if (userInput !== 'y') {
            console.log("Operation aborted.");
            return;
        }
    }

    const readStream = fs.createReadStream(LOG_FILE_PATH);
    const writeStream = fs.createWriteStream(outputFilePath);
    const rl = readline.createInterface({ input: readStream, crlfDelay: Infinity });

    console.log(`Extracting logs for ${date}...`);
    const dateRegex = new RegExp(`\\b${date}\\b`);  // Ensure proper escaping


    for await (const line of rl) {
        console.log(`Checking line: ${line}`);
        if (line.includes(date)) {
            console.log(`Matched: ${line}`);
            writeStream.write(line + '\n');
        }
    }
    

    writeStream.end();
    console.log(`Logs for ${date} saved to ${outputFilePath}`);
    process.exit(0);
}

(async function main() {
    if (process.argv.length !== 3) {
        console.error("Usage: node index.js YYYY-MM-DD");
        process.exit(1);
    }

    const date = process.argv[2];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        console.error("Invalid date format. Use YYYY-MM-DD.");
        process.exit(1);
    }

    try {
        await downloadLogFile();
        await extractLogs(date);
    } catch (error) {
        console.error("An error occurred:", error.message);
        process.exit(1);
    }
})();
