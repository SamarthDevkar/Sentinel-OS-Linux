#!/bin/bash
ip_address="$1"
port_number="8886"

# Enable sysstat and set data collection interval
sudo sed -i 's/ENABLED="false"/ENABLED="true"/' /etc/default/sysstat
sudo sed -i 's/INTERVAL=10/INTERVAL=1/' /etc/default/sysstat
sudo systemctl restart sysstat

exec 14<>/dev/tcp/"$ip_address"/"$port_number"
# Run sar command for continuous monitoring, replace the prefix, and save output to log file
sar -r 1 >&14