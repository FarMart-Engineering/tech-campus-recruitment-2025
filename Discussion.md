This solution is a Node.js script that downloads a log file from a remote URL and extracts log entries for a specified date. The extracted logs are saved to a file in an output directory.

Downloads the log file only if it doesn't already exist locally.
Uses the https module to download the file and handles errors in the process.
Reads the log file line by line and extracts lines containing the specified date.
Prompts the user to confirm overwriting an existing output file.

Run the  command node src/index.js YYYY-MM-DD
Output will be stored in the output directory with file name of the format output_YYYY-MM-DD
