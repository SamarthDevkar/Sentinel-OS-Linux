import socket
import subprocess
import boto3
from botocore.exceptions import NoCredentialsError
import json

# Load AWS credentials and bucket name from config.json
with open('config.json', 'r') as config_file:
    config_data = json.load(config_file)

BUCKET_NAME = config_data["bucket_name"]
AWS_ACCESS_KEY_ID = config_data["aws_access_key_id"]
AWS_SECRET_ACCESS_KEY = config_data["aws_secret_access_key"]

# Initialize S3 client
s3 = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

def append_logs_to_s3(logs, file_name):
        try:
                existing_logs = ''
                try:
                        # response = s3.get_object(Bucket=BUCKET_NAME, Key=LOGS_FILE_KEY)
                        response = s3.get_object(Bucket=BUCKET_NAME, Key=file_name)
                        existing_logs = response['Body'].read().decode('utf-8')
                except s3.exceptions.NoSuchKey:
                        pass

                new_logs = existing_logs + logs

                # s3.put_object(Bucket=BUCKET_NAME, Key=LOGS_FILE_KEY, Body=new_logs)
                s3.put_object(Bucket=BUCKET_NAME, Key=file_name, Body=new_logs)

                #print("Logs appended successfully to S3.")

        except NoCredentialsError:
                print("Credentials not available")



# List of ports to listen on

import threading

#ports = [8881, 8882, 8883, 8884, 8885, 8886, 8887, 8888]
ports_defined = {8880: "kernel", 8881: "iotop", 8882: "iostat", 8883: "sar", 8884: "ioping", 8885: "network", 8886: "memory", 8887: "file", 8888: "memmap", 8889: "liveprocess", 8890: "processinfo"}


def handle_client(port):
    host = '0.0.0.0'
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    server_socket.bind((host, port))

    server_socket.listen(1)

    print(f"Listening for incoming connections on {host}:{port}")

    while True:
        client_socket, client_address = server_socket.accept()

        print(f"Connection Accepted | {client_address} @ port {port} | Logging into 'logs_{ports_defined[port]}.txt'")

        while True:
            data = client_socket.recv(1024).decode('utf-8')

            if not data:
                break

            log_file = f"output/logs_{ports_defined[port]}.txt"
            append_logs_to_s3(data, log_file)
        client_socket.close()

threads = []
for port in ports_defined.keys():
    thread = threading.Thread(target=handle_client, args=(port,))
    threads.append(thread)
    thread.start()

for thread in threads:
    thread.join()