#!/bin/bash

# Install required packages
sudo apt-get update
sudo apt-get install -y auditd inotify-tools ioping iotop sysstat tshark procps jq

# Print installation status
if [ $? -eq 0 ]; then
    echo "Prerequisites installed successfully."
else
    echo "Failed to install prerequisites."
fi

