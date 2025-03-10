# seed_log_generator.py

import random
from datetime import datetime, timedelta

# Function to generate random log entries
def generate_log_entries(start_date, num_entries):
    log_levels = ['INFO', 'ERROR']
    messages = [
        "User logged in",
        "User logged out",
        "Page not found: 404",
        "Server error: 500"
    ]
    
    current_time = start_date
    log_entries = []
    
    for _ in range(num_entries):
        log_level = random.choice(log_levels)
        message = random.choice(messages)
        log_entry = f"{current_time.strftime('%Y-%m-%d %H:%M:%S')},{log_level},{message}"
        log_entries.append(log_entry)
        current_time += timedelta(minutes=random.randint(1, 10))  # Increment time randomly
    
    return log_entries

# Main execution
if __name__ == "__main__":
    start_date = datetime(2025, 1, 17, 12, 0, 0)  # Starting date
    num_entries = 3000 # Number of log entries to generate
    logs = generate_log_entries(start_date, num_entries)
    

    # Save the generated log entries to a file
    with open('generated_logs.txt', 'w') as f:
        for log in logs:
            f.write(log + '\n')