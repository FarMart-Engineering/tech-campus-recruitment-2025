/**
 * Approach 1: Linear Search through the log file
 * - This method iterates over every line in the log file, checking if it starts with the given date.
 * - Time Complexity: O(N), where N is the total number of logs.
 * - This is inefficient for very large files (e.g., 1TB logs) as it requires scanning the entire file.
 *
 * Approach 2: Binary Search on the Date
 * - Since logs are chronologically ordered, we can use binary search to quickly locate the first occurrence of the required date.
 * - Steps:
 *   1. Perform a binary search to find the first line containing the target date.
 *   2. From this position, sequentially read and extract all logs belonging to the given date.
 *   3. Stop reading when encountering a log entry with a different date.
 * - Time Complexity: O(log N) for binary search + O(K) for reading K relevant logs.
 * - This method is significantly faster and more scalable.
 */