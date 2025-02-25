Methodology Used to Solve the Log Extraction Problem
The methodology followed to extract logs from a large log file (up to 1TB in size) efficiently can be broken down into the following steps:

1. File Size Estimation and Initial Setup
The log file, potentially up to 1TB in size, can be too large to load entirely into memory. Therefore, the solution focuses on reading the file in chunks. The goal is to minimize the amount of data read at any given time, thereby reducing both memory consumption and disk I/O.

2. Binary Search for Efficient Log Retrieval
We adopted a binary search technique to locate the logs corresponding to a specified date. Here's how this approach works:

The search begins by reading a middle chunk of the file.
Based on the first log entry in that chunk, the script decides whether to continue searching to the left or right of the middle point.
If the first log entry is earlier than the target date, the search focuses on the right portion of the file.
If the first log entry is later than the target date, the search narrows down to the left portion of the file.
The process repeats until the correct section of the file is found.
3. Reading Data in Chunks
The file is read in chunks of data, initially set to 1KB. The size is adjustable as the search progresses:

Dynamic Chunk Resizing: If the middle of the search space is too large (i.e., the remaining search space is too small to be read in the current chunk size), the chunk size is reduced. This ensures that the search space doesn't exceed memory limits and that more precise results are obtained.
Each chunk read contains a log entry (with timestamp, log level, and message). If the chunk doesn’t contain the full timestamp for a log entry (i.e., the entry is split between two chunks), the search continues in adjacent chunks.
4. Log Boundary Detection
Each chunk is read, and the first line of the chunk is checked. If it starts with the target date, the script moves forward by extracting all the logs for that date from the chunk.

To ensure no relevant logs are missed, boundary checking is performed:

If the first log entry found in a chunk does not start with the target date, the script moves the search space left or right based on the comparison.
When the target date is found, the script attempts to gather all logs for the specified date from the chunk and any adjacent chunks.
The script reads backward (up to 10MB) from the midpoint to check if the previous log entries also match the target date.
Similarly, the script reads forward (up to 10MB) from the midpoint to check if more logs for the target date exist in adjacent chunks.
5. Handling Edge Cases
Several edge cases are handled to ensure robustness:

Multiple Logs on the Same Date: If there are multiple logs for the same date within a chunk, all matching logs are appended to the results.
Data Splitting: If a log entry spans multiple chunks, the script reads the adjacent chunks to ensure complete data for the log entry is retrieved.
Non-Existing Logs: If no logs exist for the target date, the script outputs a message indicating that no logs were found for that date.
6. Optimization for Large Files
Considering the file size, the process is optimized for minimal memory usage:

Chunk-based reading: Only a small portion of the file is loaded into memory at a time.
Binary search: The use of binary search allows the script to minimize the number of chunks it needs to read, focusing on narrowing the search space with each step.
Efficient extraction: By dynamically adjusting the chunk size based on the search space, the script ensures that large files can be processed without consuming excessive memory.
7. Output Handling
The logs corresponding to the target date are collected into a list and written into a file in the output directory. The output file is named according to the target date (output_YYYY-MM-DD.txt), and the logs are written in the following format:

yaml
Copy
Edit
2025-01-17 12:00:00,ERROR,User logged out
2025-01-17 12:05:00,INFO,Server error: 500
2025-01-17 12:13:00,ERROR,Page not found: 404
2025-01-17 12:17:00,INFO,User logged out
2025-01-17 12:25:00,INFO,Page not found: 404
8. Final File Structure
Once the logs for the target date are identified, they are saved in a new text file, which is named according to the target date (e.g., output_2025-01-17.txt). This ensures that logs for each date are saved separately and can be retrieved easily.

Summary of Key Techniques
Binary Search: To find the chunk containing logs for a specific date efficiently.
Dynamic Chunk Size Adjustment: To optimize memory usage and search time.
Log Boundary Checking: To ensure logs split across chunks are properly captured.
Edge Case Handling: To manage situations like multiple logs in a chunk, log splitting across chunks, or no logs found for the target date.
This methodology ensures that even very large log files can be processed efficiently, using minimal memory while retrieving logs accurately for any specified date.