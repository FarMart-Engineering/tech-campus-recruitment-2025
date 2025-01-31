So there are multiple approaches to retieve the data from logs,


Approach 1:  Open the log file and read all contents into memory.
            Filter the required logs using a list comprehension or regex
            Write the filtered logs to an output file, this way we can filter the required data from log
            But the issue with this is High Memory Usage, A 1TB file cannot be loaded into RAM at once.



            
Approach 2:
            It Opens the file in read mode, then it process one line at a time,
            If a line starts with the given date,then it will write it to the output file,
            it Uses buffered input/output for efficiency.
            why it is better? coz 
            It is Memory Efficient coz it doesn't load the entire file , rather processes line by line and
            Faster Execution coz  the Single-pass processing minimizes Input/Output.
            

            
