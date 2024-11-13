OS telemetry - Live Monitoring Tool for Linux Subsystems
Overview
The OS Telemetry project is a comprehensive live monitoring tool designed for Linux systems. It enables real-time tracking of critical subsystems, such as network activity, file system changes, memory usage, and input/output operations. The tool securely transmits all collected telemetry data directly to the cloud for storage and analysis, ensuring minimal impact on the host system and enhanced data security.

Features
Network Monitoring: Uses Tshark to capture and analyze network traffic, providing insights into network usage and potential anomalies.

Kernel Auditing: Leverages auditd to track kernel-level events and system calls, enhancing security and accountability.

File System Monitoring: Employs inotify to detect and report file system changes in real-time.

Memory Performance Analysis: Uses sar to monitor and report memory usage trends, helping to identify performance bottlenecks.
0
Input/Output Operations: Integrates iostat, ioping, and iotop to measure and analyze disk I/O operations, ensuring optimal performance.

Process Monitoring: Utilizes top to provide real-time insights into system processes and resource utilization.

Secure Data Transmission: All telemetry data is securely transmitted to an AWS S3 bucket using SSL encryption, ensuring data integrity and confidentiality.

Cloud Storage: Directly stores monitoring data in AWS S3, facilitating centralized data management and analysis without local storage on the host system.
