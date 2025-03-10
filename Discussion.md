Approaches Can be Used

Approach 1: Line by Line Searching Whole File
If logs are in a text file, the best approach is to read the file line by line without loading the entire file into memory.
But this is not efficient approach as it will take a lot of time as file size is nearly 1TB.
But for efficiency only first 10 words will do because it starts with timestamps.
Parallel processing can be used for more better performance.

Approach 2: Using Binary Search for Faster Extraction
If logs are sorted by timestamp, we can use binary search to quickly locate the starting position, instead of scanning the entire file.
Use memory-map the file to avoid full loading of the file.
Perform binary search to locate the first log with the desired timestamp.
After finding first log with desired timestamp search sequentially from that time onwards.
For this to work logs should be in a sorted order of timestamps otherwise it will not work.

Approach 3: Distributed Processing 
For extremely large logs, consider using Python Spark to distribute the log extraction.
Distributed processing makes it super fast.
Can handle TB-scale log files.
