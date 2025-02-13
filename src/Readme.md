# Source Directory
import sys

def extract_logs(log_file, target_date, output_file):
    try:
        with open(log_file, 'r', encoding='utf-8') as infile, open(output_file, 'w', encoding='utf-8') as outfile:
            for line in infile:
                if line.startswith(target_date):  # Fast string comparison
                    outfile.write(line)
        print(f"Extraction complete. Logs saved in: {output_file}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python extract_logs.py <log_file> <YYYY-MM-DD>")
        sys.exit(1)

    log_file = sys.argv[1]
    target_date = sys.argv[2]
    output_file = f"output/output_{target_date}.txt"

    extract_logs(log_file, target_date, output_file)

Make sure that your source code is in the `src` directory.
