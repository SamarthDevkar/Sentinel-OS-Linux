#!/bin/bash
ip_address="$1"
port_number="8883"

exec 13<>/dev/tcp/"$ip_address"/"$port_number"
sar -bdqp 1 >&13