const fs = require('fs');
const readline = require('readline');
const path = require('path');

const OUTPUT_DIR = 'output';


async function binarySearchFirst(filename, date) {
    const fileSize = fs.statSync(filename).size;
    let left = 0, right = fileSize, mid, result = -1;
    const stream = fs.createReadStream(filename, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    while (left <= right) {
        mid = Math.floor((left + right) / 2);
        stream.seek(mid);
        stream.read();
        rl.on('line', (line) => {
            if (line.startsWith(date)) {
                result = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        });
    }
    return result;
}

async function extractLogsForDate(filename, date) {
    if (!fs.existsSync(filename)) {
        console.error(`Error: Unable to open file ${filename}`);
        return;
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }
    const outputFilename = path.join(OUTPUT_DIR, `output_${date}.txt`);
    const writeStream = fs.createWriteStream(outputFilename);
    
    const startPos = await binarySearchFirst(filename, date);
    if (startPos === -1) {
        console.error(`Error: No logs found for date ${date}`);
        return;
    }
    
    const stream = fs.createReadStream(filename, { encoding: 'utf8', start: startPos });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
    
    for await (const line of rl) {
        if (line.startsWith(date)) {
            writeStream.write(line + '\n');
        } else {
            break;
        }
    }
    writeStream.end();
    console.log(`Logs for ${date} have been saved in ${outputFilename}`);
}

if (process.argv.length !== 4) {
    console.error(`Usage: node ${path.basename(process.argv[1])} <log_file> <YYYY-MM-DD>`);
    process.exit(1);
}

const filename = process.argv[2];
const date = process.argv[3];
extractLogsForDate(filename, date);
