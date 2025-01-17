import sys
import os

def extract_logs(date, log_file, output_dir="output"):
    """
    Extract logs for a specific date from a large log file.

    Args:
        date (str): The date to filter logs (YYYY-MM-DD).
        log_file (str): Path to the large log file.
        output_dir (str): Directory to save the output file.
    """
    if not os.path.exists(log_file):
        print(f"Error: Log file '{log_file}' does not exist.")
        return

    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    output_file = os.path.join(output_dir, f"output_{date}.txt")
    
    try:
        with open(log_file, 'r') as file, open(output_file, 'w') as output:
            for line in file:
                # Match lines starting with the given date (up to the 'T')
                if line.startswith(date + "T"):
                    output.write(line)
        print(f"Logs for {date} have been saved to {output_file}.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python extract_logs.py <YYYY-MM-DD>")
        sys.exit(1)
    
    # Input date from command-line argument
    date = sys.argv[1]
    log_file = "logs_2024.log"  # Adjust the file name as needed
    
    extract_logs(date, log_file)
