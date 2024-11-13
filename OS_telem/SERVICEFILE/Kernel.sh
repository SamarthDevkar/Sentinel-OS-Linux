#!/bin/bash
# Accept the IP address and port number as arguments
ip_address="$1"
port_number="8880"

sudo auditctl -a always,exit -F arch=b64 -S all
sudo service auditd start

# Open the network connection
exec 6<>/dev/tcp/"$ip_address"/"$port_number"

# Function to send the entire audit log
send_audit_log_data() {
    audit_log="/var/log/audit/audit.log"
    cat "$audit_log"
}

while true; do
    send_audit_log_data | {
        while read -r line; do
            echo "$line" >&6
        done
    }
    sleep 180  # Send the log every 5 minutes (adjust as needed)
done

