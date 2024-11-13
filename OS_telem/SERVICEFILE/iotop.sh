#!/bin/bash
ip_address="$1"
port_number="8881"

exec 16<>/dev/tcp/"$ip_address"/"$port_number"

sudo iotop -o -b >&16
