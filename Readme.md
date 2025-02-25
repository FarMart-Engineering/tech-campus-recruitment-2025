## Steps to Run

1. **Clone the repository:**
    ```sh
    git clone https://github.com/prabal-rawal/tech-campus-recruitment-2025/tree/final
    cd tech-campus-recruitment-2025
    ```

2. **Navigate to the source directory:**
    ```sh
    cd src
    ```

3. **Install dependencies:**
    Ensure you have Python 3 installed. You can create a virtual environment and install dependencies if needed.
    ```sh
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

4. **Run the solution:**
    Use the following command to extract logs for a specific date. Replace `2024-12-01` with the desired date in `YYYY-MM-DD` format.
    ```sh
    python3 extract_log.py 2024-12-01 --log-file path/to/your/logfile.log --output-dir path/to/output/directory --processes 8
    ```

    - `--log-file`: Path to the log file (default: `logs_2024.log` in the current directory).
    - `--output-dir`: Directory to save output files 
    - `--processes`: Number of processes to use (default: number of CPU cores).

5. **View the output:**
    The output will be generated in the specified output directory. You can find the output file named `output_YYYY-MM-DD.txt`.

For example:
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
