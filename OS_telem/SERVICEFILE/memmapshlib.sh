#!/bin/bash
ip_address="$1"
port_number="8888"

# Open the network connection
exec 10<>/dev/tcp/"$ip_address"/"$port_number"

capture_memory_info() {
    local pid="$1"

    echo "-------------------"
    date
    echo "PID: $pid"

    # Memory map
    echo "Memory Map:"
    pmap -x "$pid"

    # Shared libraries
    echo "Shared Libraries:"
    cat "/proc/$pid/maps" | grep "lib"

    # Heap allocations
    echo "Heap Allocations:"
    cat "/proc/$pid/maps" | grep -E "heap|malloc|calloc"
}

    # Capture data for all PIDs
for pid in /proc/[0-9]*; do
    if [ -d "$pid" ]; then
        pid_name=$(basename "$pid")
        capture_memory_info "$pid_name"
    fi
done | {
    while read -r line; do
        echo "$line" >&10
    done
}

