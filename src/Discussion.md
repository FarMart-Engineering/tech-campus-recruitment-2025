# Solution Discussion

## Solutions Considered

1. **Naive Approach**: Read the file line by line
   - Pros: Simple implementation
   - Cons: O(n) time complexity, inefficient for 1TB file

2. **Index-based Approach**: Create an index file first
   - Pros: Very fast subsequent queries
   - Cons: Requires additional storage, initial indexing time

3. **Binary Search with Streaming** (Chosen Solution)
   - Pros: 
     - O(log n) time complexity
     - Memory efficient using streams/chunks
     - No additional storage needed
   - Cons:
     - More complex implementation


### JavaScript Version
1. Navigate to the src directory
2. Update the log file path in extract_logs.js
3. Run: `node extract_logs.js YYYY-MM-DD` 