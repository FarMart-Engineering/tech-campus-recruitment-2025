#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Get target date from command-line arguments
const targetDate = process.argv[2];
if (!targetDate || !/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
  console.error('Error: Please provide a date in the format YYYY-MM-DD');
  process.exit(1);
}

// Setup output directory and file paths
const outputDir = path.join(__dirname, '../output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputFile = path.join(outputDir, `output_${targetDate}.txt`);
const outputStream = fs.createWriteStream(outputFile);
const logFilePath = path.join(__dirname, 'logs.txt');

if (!fs.existsSync(logFilePath)) {
  console.error(`Error: Log file not found at ${logFilePath}`);
  process.exit(1);
}

// Estimate the approximate file position where logs for the target date might start
async function estimatePosition(filePath, targetDate) {
  const stats = fs.statSync(filePath);
  const fileSize = stats.size;
  const sampleSize = 1024;
  
  // Read the first few bytes to get the first log entry
  const buffer = Buffer.alloc(sampleSize);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buffer, 0, sampleSize, 0);
  fs.closeSync(fd);
  const firstDateStr = buffer.toString().split('\n')[0].substring(0, 10);

  // Read the last few bytes to get the last log entry
  const endBuffer = Buffer.alloc(sampleSize);
  const endFd = fs.openSync(filePath, 'r');
  fs.readSync(endFd, endBuffer, 0, sampleSize, Math.max(0, fileSize - sampleSize));
  fs.closeSync(endFd);
  const lastDateStr = endBuffer.toString().split('\n').slice(-2, -1)[0].substring(0, 10);

  const firstDate = new Date(firstDateStr);
  const lastDate = new Date(lastDateStr);
  const targetDateObj = new Date(targetDate);
  
  const totalDays = (lastDate - firstDate) / (24 * 60 * 60 * 1000);
  const daysToTarget = (targetDateObj - firstDate) / (24 * 60 * 60 * 1000);

  const estimatedPosition = Math.floor((daysToTarget / totalDays) * fileSize);
  return { estimatedPosition, fileSize };
}

// Find the exact file position where logs for the target date start
async function findDateStartPosition(filePath, targetDate, initialEstimate, fileSize) {
  let left = 0, right = fileSize, currentPos = initialEstimate;
  let attempts = 0, found = false;
  const MAX_ATTEMPTS = 30;

  while (attempts < MAX_ATTEMPTS && right - left > 1) {
    attempts++;
    const buffer = Buffer.alloc(4096);
    const fd = fs.openSync(filePath, 'r');

    try {
      fs.readSync(fd, buffer, 0, 4096, currentPos);
      fs.closeSync(fd);
      
      const text = buffer.toString();
      const firstLine = text.split('\n')[0];
      const lineDateStr = firstLine.substring(0, 10);

      if (lineDateStr === targetDate) {
        right = currentPos;
        currentPos = Math.max(0, currentPos - 1000000);
        found = true;
      } else {
        const lineDate = new Date(lineDateStr);
        const targetDateObj = new Date(targetDate);
        
        if (lineDate < targetDateObj) {
          left = currentPos;
        } else {
          right = currentPos;
        }
        currentPos = Math.floor((left + right) / 2);
      }
    } catch (error) {
      fs.closeSync(fd);
      console.error('Error reading log file:', error);
      return 0;
    }
  }

  return Math.max(0, left);
}

// Extract logs for the target date from the log file
async function processLogFile(filePath, targetDate) {
  console.log(`Extracting logs for: ${targetDate}`);
  try {
    const { estimatedPosition, fileSize } = await estimatePosition(filePath, targetDate);
    const startPosition = await findDateStartPosition(filePath, targetDate, estimatedPosition, fileSize);
    
    const fileStream = fs.createReadStream(filePath, { start: startPosition, highWaterMark: 1024 * 1024 });
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    
    let matchCount = 0, foundTargetDate = false;
    for await (const line of rl) {
      if (line.startsWith(targetDate)) {
        outputStream.write(line + '\n');
        matchCount++;
        foundTargetDate = true;
      } else if (foundTargetDate && !line.startsWith(targetDate)) {
        break;
      }
    }
    
    outputStream.end();
    console.log(matchCount ? `Found ${matchCount} log entries.` : `No logs found for ${targetDate}.`);
  } catch (error) {
    console.error('Error processing log file:', error);
    process.exit(1);
  }
}

processLogFile(logFilePath, targetDate);
