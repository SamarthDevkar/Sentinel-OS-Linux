#!/bin/bash

# Cleanup function to stop background processes
cleanup() {
    echo "Stopping the monitoring scripts..."

    # Terminate background processes from other script files
    pkill -f "Memory.sh"
    pkill -f "File_monitoring.sh"
    pkill -f "Liveprocess.sh"
    pkill -f "sar.sh"
    pkill -f "ioping.sh"
    pkill -f "iotop.sh"
    pkill -f "iostat.sh"
    pkill -f "Network.sh"
    pkill -f "memmapshlib.sh"
    pkill -f "Process_info.sh"
    pkill -f "Kernel.sh"
    sudo service auditd stop

    # Add more lines for other script files as needed

    # Terminate the background upload_to_aws_bucket and delete_files functions
    pkill -f "upload_folder_to_s3"
    pkill -f "delete_files"
    exit 0
}

while true
do
    cleanup
done