# Discussion: Efficient Log Retrieval

## Solutions Considered:
1. **Line-by-Line Processing (Best Approach)**
   - Reads the log file one line at a time.
   - Memory efficient and works well for large files.

2. **Database Indexing**
   - Faster for repeated queries but impractical due to high storage needs.

## Final Solution:
- Implemented a C++ script that:
  - Reads the file **line-by-line**.
  - Writes only matching log entries to `output/output_YYYY-MM-DD.txt`.

## Steps to Run:
1. Compile the program:
   ```bash
   g++ -o extract_logs src/extract_logs.cpp
