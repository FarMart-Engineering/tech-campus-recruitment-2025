#!/usr/bin/env python3
import os
import sys
import re
import time
import argparse
import multiprocessing
from datetime import datetime
from pathlib import Path
from functools import partial

def process_chunk(target_date, chunk_data, chunk_id):

    try:
        text_data = chunk_data.decode('utf-8', errors='replace')
        
        pattern = re.compile(f'^{re.escape(target_date)}.*?$', re.MULTILINE)
        
        matches = pattern.findall(text_data)
        
        return matches
        
    except Exception as e:
        print(f"Error processing chunk {chunk_id}: {e}")
        return []

def extract_logs_by_date(log_file_path, target_date, output_dir="output", num_processes=None):

    start_time = time.time()
    
    Path(output_dir).mkdir(exist_ok=True)
    
    output_file_path = f"{output_dir}/output_{target_date}.txt"
    
    file_size = os.path.getsize(log_file_path)
    print(f"Log file size: {file_size / (1024**3):.2f} GB")
    
    if num_processes is None:
        num_processes = multiprocessing.cpu_count()
    print(f"Using {num_processes} processes")

    TARGET_CHUNKS = num_processes * 4  
    chunk_size = max(100 * 1024 * 1024, file_size // TARGET_CHUNKS) 
    print(f"Chunk size: {chunk_size / (1024**3):.2f} GB")
    
    pool = multiprocessing.Pool(processes=num_processes)
    
    all_matches = []
    
    with open(log_file_path, 'rb') as f:
        chunk_id = 0
        position = 0
        
        while position < file_size:
            f.seek(position)
            chunk_data = f.read(chunk_size)
            if not chunk_data:
                break
                
            last_newline = chunk_data.rfind(b'\n')
            if last_newline != -1 and last_newline < len(chunk_data) - 1:
                f.seek(position + last_newline + 1)
                actual_chunk = chunk_data[:last_newline + 1]
            else:
                actual_chunk = chunk_data
            
            chunk_id += 1
            process_func = partial(process_chunk, target_date, actual_chunk, chunk_id)
            all_matches.append(pool.apply_async(process_func))
            
            position = f.tell()
            
            progress = (position / file_size) * 100
            print(f"Processing: {progress:.1f}% (Chunk {chunk_id})", end="\r")
    
    pool.close()
    
    print("\nCollecting results...")
    all_log_entries = []
    for result in all_matches:
        all_log_entries.extend(result.get())
    
    print(f"Writing {len(all_log_entries)} log entries to output file...")
    with open(output_file_path, 'w') as out_file:
        for entry in all_log_entries:
            out_file.write(f"{entry}\n")
    
    pool.join()
    
    elapsed_time = time.time() - start_time
    print(f"Extraction completed in {elapsed_time:.2f} seconds")
    print(f"Output saved to {output_file_path}")
    
    return output_file_path

def estimate_optimal_chunk_size(file_size, num_processes):
    target_chunks = num_processes * 3
    
    chunk_size = file_size // target_chunks
    
    min_chunk_size = 10 * 1024 * 1024  
    max_chunk_size = 1024 * 1024 * 1024  
    
    return max(min_chunk_size, min(chunk_size, max_chunk_size))

def binary_boundary_search(log_file_path, target_date, window_size=1024*1024*10):
    return None, None

def main():
    parser = argparse.ArgumentParser(description='Extract logs for a specific date from a large log file')
    parser.add_argument('date', help='Date in YYYY-MM-DD format')
    parser.add_argument('--log-file', default='logs_2024.log', 
                        help='Path to the log file (default: logs_2024.log in current directory)')
    parser.add_argument('--output-dir', default='output', 
                        help='Directory to save output files')
    parser.add_argument('--processes', type=int, default=None,
                        help='Number of processes to use (default: number of CPU cores)')
    
    args = parser.parse_args()
    
    try:
        datetime.strptime(args.date, "%Y-%m-%d")
        
        if not os.path.exists(args.log_file):
            print(f"Error: Log file not found: {args.log_file}")
            sys.exit(1)
            
        extract_logs_by_date(args.log_file, args.date, args.output_dir, args.processes)
        
    except ValueError:
        print("Error: Invalid date format. Please use YYYY-MM-DD")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nOperation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()