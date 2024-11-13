#!/bin/bash
ip_address="$1"
port_number="8889"

# Initialize an empty array for allowed_processes
allowed_processes=()

# Read process names from config.json and store them in allowed_processes
while IFS= read -r process; do
    allowed_processes+=("$process")
done < <(jq -r '.process[]' config.json)

exec 4<>/dev/tcp/"$ip_address"/"$port_number"

capture_process() {
    line_count=0
    while IFS= read -r line; do
        ((line_count++))
        # Skip the first 7 lines
        if [ "$line_count" -le 7 ]; then
            echo "$line"
        else
            process_name=$(echo "$line" | awk '{print $NF}')
            if [[ " ${allowed_processes[@]} " =~ " $process_name " ]]; then
                echo "WHITELISTED: $line"
            else
                echo "BLACKLISTED: $line"
            fi
        fi
    done < <(top -b -n 1)
}

while true; do
    {
        capture_process | while read -r line; do
            echo "$line" >&4
        done
    }
    sleep 10
done