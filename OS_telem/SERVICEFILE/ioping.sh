#!/bin/bash

ip_address="$1"
port_number="8884"

# Open the network connection
exec 4<>/dev/tcp/"$ip_address"/"$port_number"

# Function to send ioping output over the network
send_ioping_data() {
    # Loop through all storage devices (e.g., /dev/sda, /dev/sdb, /dev/sdc, etc.)
    for device in /dev/sda*; do
        # Run ioping with 10 requests to measure disk I/O latency for each device
        ioping -c 10 "$device" | while read -r line; do
            echo "$line"
        done
    done
}

# Continuously send ioping data over the network connection
while true; do
    send_ioping_data >&4
    sleep 60  # Adjust the sleep interval as needed
done

# Close the network connection (this won't be reached in this script)
exec 4>&-



