#!/bin/bash

ip_address="$1"
port_number="8887"

# Function to clean up before exiting
cleanup() {
    echo "Stopping the monitoring script..."
    pkill inotifywait  # Terminate all inotifywait processes
    exit 0
}
sudo sysctl fs.inotify.max_user_watches=300000

# Trap the termination signal (Ctrl+C) and call the cleanup function
trap cleanup SIGINT

# Array of directories to monitor
DIRECTORIES=(
    "/"
)

# Array of paths to monitor
paths=(
    "/etc"
    )

# Function to monitor events for a directory
monitor_directory() {
    local DIR=$1

    trap cleanup EXIT

    inotifywait -m -r -e create,delete,modify,move,move_self,moved_to,attrib --format '%e %w%f' "$DIR" |
    while read -r EVENT_PATH; do
        # Extract the event type and file path from the "EVENT_PATH" variable
        EVENT_TYPE=$(echo "$EVENT_PATH" | awk '{print $1}')
        FILE_PATH=$(echo "$EVENT_PATH" | awk '{print $2}')
        TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
        if [ -e "$FILE_PATH" ]; then
          USER_INFO=$(ls -n "$FILE_PATH" | awk '{print $3}')
          GROUP_INFO=$(ls -n "$FILE_PATH" | awk '{print $4}')
          USERNAME=$(getent passwd "$USER_INFO" | awk -F: '{print $1}')
          GROUPNAME=$(getent group "$GROUP_INFO" | awk -F: '{print $1}')
        else 
          USERNAME="N/A"
          GROUPNAME="N/A"
        fi
        # Check if the path or its parent is in the paths array
        blacklisted="false"
        for path in "${paths[@]}"; do
            if [[ "$FILE_PATH" == "$path"* ]]; then
                blacklisted="true"
                break
            fi
        done

        echo "Timestamp: $TIMESTAMP | User: $USERNAME | Group: $GROUPNAME | Event: $EVENT_TYPE, File: $FILE_PATH, Blacklisted: $blacklisted" >&5
    done 5<>/dev/tcp/$ip_address/$port_number
}

# Main script
for DIR in "${DIRECTORIES[@]}"; do
    if [[ -d "$DIR" ]]; then
        echo "Monitoring directory: $DIR"
        monitor_directory "$DIR"
    else
        echo "Error: Directory $DIR does not exist or is not accessible."
    fi
done
