const fs = require("fs");
const readline = require("readline");
const path = require("path");

const OUTPUT_DIR = "./output";

// Function to perform binary search for the first occurrence of the date
async function binarySearchFirst(filePath, date) {
    const fileSize = fs.statSync(filePath).size;
    let left = 0, right = fileSize, mid, result = -1;
    const bufferSize = 1024 * 1024; // 1 MB chunks

    while (left <= right) {
        mid = Math.floor((left + right) / 2);
        const buffer = Buffer.alloc(bufferSize);
        const fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, bufferSize, mid);
        fs.closeSync(fd);

        const chunk = buffer.toString('utf8');
        const lines = chunk.split('\n');

        // Check the first and last line of the chunk
        const firstLine = lines[0];
        const lastLine = lines[lines.length - 1];

        // If the first line starts with the date, update the result and move left
        if (firstLine.startsWith(date)) {
            result = mid;
            right = mid - 1;
        }
        // If the last line starts with the date, update the result and move right
        else if (lastLine.startsWith(date)) {
            result = mid;
            left = mid + 1;
        }
        // If the first line is lexicographically less than the date, move right
        else if (firstLine < date) {
            left = mid + 1;
        }
        // Otherwise, move left
        else {
            right = mid - 1;
        }
    }

    return result;
}

// Function to extract logs for a given date
async function extractLogsForDate(logFile, date) {
    if (!fs.existsSync(logFile)) {
        console.error(`Error: Unable to open file ${logFile}`);
        return;
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const outputFilename = path.join(OUTPUT_DIR, "output_logs.txt");
    const writeStream = fs.createWriteStream(outputFilename);

    const startPos = await binarySearchFirst(logFile, date);
    if (startPos === -1) {
        console.error(`Error: No logs found for date ${date}`);
        return;
    }

    const readStream = fs.createReadStream(logFile, { encoding: "utf8", start: startPos });
    const rl = readline.createInterface({ input: readStream });

    for await (const line of rl) {
        if (line.startsWith(date)) {
            writeStream.write(line + "\n");
        } else {
            break;
        }
    }

    console.log(`Logs for ${date} have been saved in ${outputFilename}`);
}

// Command-line execution
if (process.argv.length !== 3) {
    console.error(`Usage: node ${path.basename(process.argv[1])} <log_file> <YYYY-MM-DD>`);
    process.exit(1);
}

const logFile = "./sample_logs.txt";
const date = process.argv[2];

extractLogsForDate(logFile, date);
