#!/bin/bash
ip_address="$1"
port_number="8882"

exec 15<>/dev/tcp/"$ip_address"/"$port_number"

iostat -xdmt 1 >&15