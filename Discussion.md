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
steps:
            So the script is designed to pull out log entries for a specific date from a large log file.
            First, it checks if the output directory exists and creates it if necessary. Then, it reads through the log file line by line, checking if each                 line starts with the target date.
            If it does, the line is written to an output file. The script also includes error handling to manage missing files or other unexpected issues.                 

            
            

            
