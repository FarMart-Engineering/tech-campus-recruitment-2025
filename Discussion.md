Discussion.md
Solutions Considered
Reading the Entire File into Memory:

Initially considered loading the entire log file into memory and filtering logs for the specified date.
Why Rejected: This approach is not feasible for a 1 TB file due to memory constraints and inefficiency.
Line-by-Line Processing:

Process the file line by line using Python's file handling.
Check each line for the specified date and write matching lines to the output file.
Why Chosen: This approach is memory-efficient and scalable for large files.
Using Tools Like grep or Log Management Systems:

Considered using Unix tools like grep or log management platforms like Elasticsearch for faster processing.
Why Rejected: These require additional setup or dependencies, while the Python solution works out-of-the-box and meets the requirements.
Final Solution Summary
The final solution processes the log file line by line.
It matches lines starting with the specified date in YYYY-MM-DDT format (ISO 8601).
Matching lines are written to an output file in the output/ directory.
Steps to Run
Ensure Prerequisites:

Python 3 is installed.
The log file (logs_2024.log) is in the root directory of the repository.
Run the Script:

Use the following command to extract logs for a specific date:
bash
Copy
python src/extract_logs.py <YYYY-MM-DD>
Example:
bash
Copy
python src/extract_logs.py 2024-12-10
Check the Output:

The extracted logs will be saved in the output/ directory with the file name output_<YYYY-MM-DD>.txt.
Verify the Results:

Open the output file to confirm the logs for the specified date are extracted correctly.