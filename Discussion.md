# Discussion on the Log Retrieval Solution


## Initial Thought: Linear Search (Brute Force Approach)

The first approach was to scan the entire file line by line, checking if each log entry starts with the required date. If it matched, I would store it in an output file.

- **Time Complexity:** O(n), where n is the number of lines in the file.
- **Space Complexity:** O(1), as I only store the matching logs.

### Why This Didn’t Work

Since the log file is very large, this approach was inefficient. Even if I needed logs for just one specific day, I had to go through years’ worth of logs. This made the solution too slow.

---

## Next Idea: Sorting the Logs

To improve efficiency, I thought of sorting the logs by date. If the file was sorted, I could apply binary search to quickly find logs for any given date.And it is going to take only logn time for subsequent times

- **Sorting Time Complexity:** O(n log n) for one-time sorting.
- **Query Time Complexity:** O(log n) for searching.

### Why This Didn’t Work

After analyzing the problem further, I realized that logs are already written in chronological order. This meant that sorting was unnecessary because the logs are naturally sorted.

---

## Hashmap-Based Approach

Another approach was to preprocess the file and store log entries in a hashmap, where the key would be the date and the value would be a list of logs for that date. This would allow for constant-time lookups.

- **Time Complexity:** O(1) for searching after preprocessing.
- **Space Complexity:** O(n), as I would need to store all logs in memory.

### Why This Didn’t Work

Since the file is extremely large, storing all logs in memory would require too much space. This approach was impractical as it would waste system resources.

---

## The Key Realisation: Logs Are Already Sorted – Use Binary Search

Since logs are stored chronologically, I realized that I could directly apply binary search to find the first occurrence of the target date. After finding this starting point, I could simply read sequentially until the date changed.

### How This Works

1. **Binary Search:** Locate the first log entry for the given date. This takes O(log n) time.
2. **Sequential Scan:** Read logs line by line from the found position until the date changes. This takes O(k) time, where k is the number of logs for that date.

### Why This is the Best Approach

- **Fast search time:** O(log n) + O(k), which is much better than O(n).
- **Low memory usage:** Reads only the necessary logs without loading everything into memory.
- **Efficient file handling:** Works well even for large files.


