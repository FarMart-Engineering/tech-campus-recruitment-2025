## Solutions Considered

### Approach 1: Memory Mapping & Binary Search

This method leverages Python's `mmap` module and a binary search algorithm to efficiently extract logs without loading the entire file into RAM.

#### Key Features:
- **Memory Mapping**: Uses `mmap` to map the file into virtual memory, enabling efficient random access.
- **Binary Search Algorithm**: Speeds up log retrieval by leveraging the chronological order of log entries.
- **Smart Initial Positioning**: Estimates the starting point based on the target date, assuming logs are evenly distributed.
- **Chunked Processing**: Reads the file in manageable 10MB chunks to optimize memory usage while maintaining performance.
- **Line Boundary Handling**: Ensures complete log entries by correctly managing line boundaries when reading chunks.

### Approach 2: Multiprocessing & Regex Matching

This method employs multiprocessing with regex pattern matching to enhance efficiency when extracting logs from large files.

#### Key Features:
- **Multiprocessing**: Divides the file into chunks and processes them in parallel using Python’s multiprocessing library, utilizing all available CPU cores.
- **Regex Pattern Matching**: Efficiently identifies log entries starting with the target date, improving speed and accuracy.
- **Smart Chunking**:
  - Dynamically determines optimal chunk sizes based on file size and CPU cores.
  - Ensures each chunk ends at a newline to prevent splitting log entries.
  - Balances memory usage and processing efficiency.
- **Progress Reporting**: Displays real-time progress updates during extraction.
- **Error Handling**: Ensures robust error management, preventing failures in one chunk from affecting the entire operation.

## Final Solution Summary

The multiprocessing approach with regex matching significantly improves performance for large log files, especially on multi-core machines. This method ensures accurate log extraction while maintaining efficiency.

```sh
prabalrawal@Prabals-MacBook-Air src % python3 extract_log.py 2024-12-01
Log file size: 5.00 GB
Using 8 processes
Chunk size: 0.16 GB
Processing: 100.0% (Chunk 33)
Collecting results...
Writing 226025 log entries to output file...
Extraction completed in 16.33 seconds
Output saved to output/output_2024-12-01.txt
```

