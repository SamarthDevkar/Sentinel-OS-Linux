#!/bin/bash
ip_address="$1"
port_number="8885"
exec 17<>/dev/tcp/"$ip_address"/"$port_number"
interface="eth0"

#Initialize an empty array for the whitelist
whitelist=()

# Read IP addresses from config.json and store them in the whitelist array
while IFS= read -r ip; do
    whitelist+=("$ip")
done < <(jq -r '.IPs[]' config.json)

# Run tshark to continuously capture packets and save to a log file
tshark -i "$interface" -f "not (port 8880 or port 8881 or port 8882 or port 8883 or port 8884 or port 8885 or port 8886 or port 8887 or port 8888 or port 8889 or port 8890)" -T fields -e frame.number -e frame.time -e ip.src -e ip.dst -e tcp.srcport -e tcp.dstport -e udp.srcport -e udp.dstport -e frame.len -e frame.protocols -E header=y -E separator=, | while IFS=, read -r frame_number frame_time ip_src ip_dst tcp_src_port tcp_dst_port udp_src_port udp_dst_port frame_len frame_protocols; do
  # Skip the first line
  if [ "$frame_number" == "frame.number" ]; then
    echo "$frame_number,$frame_time,$ip_src,$ip_dst,$tcp_src_port,$tcp_dst_port,$udp_src_port,$udp_dst_port,$frame_len,$frame_protocols" >&17
    continue
  fi

  # Check if the packet has at least one IP address
  if [ -z "$ip_src" ] || [ -z "$ip_dst" ]; then
    continue
  fi

  # Check if the IP is whitelisted
  whitelisted="Blacklisted"
  for ip in "${whitelist[@]}"; do
    if [ "$ip_src" == "$ip" ] || [ "$ip_dst" == "$ip" ]; then
      whitelisted="Valid IP"
      break
    fi
  done

  # Output the log with the whitelisted field
  echo "$frame_number,$frame_time,$ip_src,$ip_dst,$tcp_src_port,$tcp_dst_port,$udp_src_port,$udp_dst_port,$frame_len,$frame_protocols,$whitelisted" >&17
done
