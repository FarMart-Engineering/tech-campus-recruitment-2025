Streaming Read: Instead of loading the entire file into memory, process it line by line.
Pattern Matching: Since each log entry starts with a timestamp (YYYY-MM-DD HH:MM:SS), extract lines matching the specified date (YYYY-MM-DD).
Efficient Output Writing: Write matching entries directly to an output file to avoid excessive memory usage.
Multi-threading/Parallel Processing (Optional): If the file is compressed or split into chunks, use multiple threads/processes to speed up filtering.

