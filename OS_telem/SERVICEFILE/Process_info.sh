#!/bin/bash
ip_address="$1"
port_number="8890"

# Open the network connection
exec 9<>/dev/tcp/"$ip_address"/"$port_number"

capture_process_info() {
    pids=$(ps -eo pid --no-headers)
    {
        for pid in $pids; do
            echo "-------------------"
            date
            echo "PID: $pid"

            # Process information
            ps -o pid,rss,vsz,cmd -p $pid

            # Status information
            if [ -e "/proc/$pid/status" ]; then
                cat "/proc/$pid/status"
            fi
        done
    } | {
        while read -r line; do
            echo "$line" >&9
        done
    }
}

while true; do
    capture_process_info | {
        while read -r line; do
            echo "$line" >&9
        done
    }
    sleep 120  # Send process info every 7 minutes (adjust as needed)
done

