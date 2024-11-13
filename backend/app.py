from flask import Flask, jsonify, send_file # type: ignore
import boto3 # type: ignore
import os
import re
import io
import zipfile
import botocore # type: ignore
from flask_cors import CORS # type: ignore

app = Flask(__name__)
CORS(app)

# Set AWS credentials as environment variables
os.environ['AWS_ACCESS_KEY_ID'] = ''
os.environ['AWS_SECRET_ACCESS_KEY'] = ''
os.environ['AWS_DEFAULT_REGION'] = 'us-east-1'


@app.route('/')
def helloWorld():
    return "Hello World !!"

@app.route('/network_logs')
def logs_network_to_json():
    s3 = boto3.client('s3')
    bucket_name = 'ostelemetry1'
    
    try:
        response = s3.get_object(Bucket=bucket_name, Key='output/logs_network.txt')
        file_content = response['Body'].read().decode('utf-8')
        lines = file_content.splitlines()
        
        blacklisted_count = 0
        whitelisted_count = 0
        json_data = []
        values_part = []
        
        for line in lines[1:]:
            if line.strip() and not line.startswith(('frame.number', 'frame.number,frame.time,ip.src,ip.dst,tcp.srcport,tcp.dstport,udp.srcport,udp.dstport,frame.len,frame.protocols', '%Cpu(s):', 'MiB Mem :', 'MiB Swap:')):
                values = line.split(',')
                
                if len(values) != 12:
                    continue
                
                timestamp = " ".join(values[1:3]).strip()
                
                entry = {
                    "frame.number": values[0].strip(),
                    "frame.time": timestamp,
                    "ip.src": values[3].strip(),
                    "ip.dst": values[4].strip(),
                    "tcp.srcport": values[5].strip(),
                    "tcp.dstport": values[6].strip(),
                    "udp.srcport": values[7].strip(),
                    "udp.dstport": values[8].strip(),
                    "frame.len": values[9].strip(),
                    "frame.protocols": values[10].strip(),
                    "listing": values[11].strip()
                }
                
                if entry["listing"] == "Blacklisted":
                    blacklisted_count += 1
                elif entry["listing"] == "Valid IP":
                    whitelisted_count += 1
                
                json_data.append(entry)
                
        return jsonify({'logs': json_data, 'blacklisted_count': blacklisted_count, 'whitelisted_count': whitelisted_count})
    
    except Exception as e:
        return jsonify({'error': f"Error converting logs to JSON: {e}"})


@app.route('/file_logs')
def convert_logs_to_json():
    s3 = boto3.client('s3')
    bucket_name = 'ostelemetry1'
    
    try:
        response = s3.get_object(Bucket=bucket_name, Key='output/logs_file.txt')
        file_content = response['Body'].read().decode('utf-8')
        
        lines = file_content.splitlines()
        
        blacklisted_count = 0
        whitelisted_count = 0
        json_data = []
        
        for line in lines:
            parts = line.split(' | ')
            if len(parts) >= 4:
                timestamp = parts[0].split(': ')[1].strip()
                user = parts[1].split(': ')[1].strip()
                group = parts[2].split(': ')[1].strip()
                event = parts[3].split(", ")[0].split(": ")[1].strip()
                filePath = parts[3].split(", ")[1].split(": ")[1]
                
                entry = {
                    'timestamp': timestamp,
                    'user': user,
                    'group': group,
                    'event': event,
                    'file': filePath
                }
                
                if len(parts[3].split(", ")) >= 3:
                    listing = parts[3].split(", ")[2].split(": ")[1]
                    if listing == "true":
                        entry['listing'] = "Blacklist"
                        blacklisted_count += 1
                    elif listing == "false":
                        entry['listing'] = "Whitelist"
                        whitelisted_count += 1

                json_data.append(entry)
        
        return jsonify({'logs': json_data, 'blacklisted_count': blacklisted_count, 'whitelisted_count': whitelisted_count})
    
    except Exception as e:
        return jsonify({'error': f"Error converting logs to JSON: {e}"})

@app.route('/process_info')
def process_info():
    s3 = boto3.client('s3')
    bucket_name = 'ostelemetry1'
    file_key = 'output/logs_processinfo.txt'
    
    try:
        response = s3.get_object(Bucket=bucket_name, Key=file_key)
        file_content = response['Body'].read().decode('utf-8')
        
        # Process the file content into JSON format
        data = []
        block = {}
        header = None
        for line in file_content.split('\n'):
            if line.strip() == '-------------------':
                if block:
                    data.append(block)
                    block = {}
                    header = None
            elif header is None:
                block['date'] = line.strip()
                header = True
            elif ':' in line:
                key, value = line.split(':', 1)
                block[key.strip()] = value.strip()
            elif header:
                columns = line.split()
                block['columns'] = columns
                header = False
            else:
                values = line.split()
                if len(columns) == len(values):
                    for i in range(len(columns)):
                        block[columns[i].strip()] = values[i].strip()
                else:
                    # Handle mismatch between columns and values
                    new_values = values[:-2] + [' '.join(values[-2:])]
                    for i in range(min(len(columns), len(new_values))):
                        block[columns[i].strip()] = new_values[i].strip()
                    # Add N/A for missing values
                    for j in range(len(new_values), len(columns)):
                        block[columns[j].strip()] = 'N/A'

        # Append the last block
        if block:
            data.append(block)

        return jsonify(data)
    
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/memory_logs')
def memory_logs_to_json():
    s3 = boto3.client('s3')
    bucket_name = 'ostelemetry1'
    
    try:
        response = s3.get_object(Bucket=bucket_name, Key='output/logs_memory.txt')
        file_content = response['Body'].read().decode('utf-8')
        
        lines = file_content.splitlines()
        parsed_logs = []
        
        for line in lines:
            if line.strip() and not line.startswith('Linux') and not line.startswith("Average"):
                values = line.split()
                if len(values) > 1:
                    if any(c.isalpha() for c in values[3]):
                        continue 
                    time = values.pop(1) if 'AM' in values[1] or 'PM' in values[1] else ''
                    log_object = {
                        'time': values[0],
                        'kbmemfree': values[1],
                        'kbavail': values[2],
                        'kbmemused': values[3],
                        '%memused': values[4],
                        'kbbuffers': values[5],
                        'kbcached': values[6],
                        'kbcommit': values[7],
                        '%commit': values[8],
                        'kbactive': values[9],
                        'kbinact': values[10],
                        'kbdirty': values[11]
                    }
                    parsed_logs.append(log_object)
        
        return jsonify({'logs': parsed_logs})
    
    except Exception as e:
        return jsonify({'error': str(e)})
    

@app.route('/liveprocess_logs')
def liveprocess_logs_to_json():
    s3 = boto3.client('s3')
    bucket_name = 'ostelemetry1'
    file_key = 'output/logs_liveprocess.txt'
    
    try:
        response = s3.get_object(Bucket=bucket_name, Key=file_key)
        file_content = response['Body'].read().decode('utf-8')

        lines = file_content.splitlines()
        
        blacklisted_count = 0
        whitelisted_count = 0
        parsed_logs = []
        
        for line in lines:
            if line.strip() and not line.startswith(('top', 'Tasks:', '%Cpu(s):', 'MiB Mem :', 'MiB Swap:')):
                values = line.split()
                if len(values) >= 12:
                    if any(val.startswith('%') for val in values):
                        continue
                    log_object = {
                        'listing': values[0].rstrip(':'), 
                        'PID': values[1],
                        'USER': values[2],
                        'PR': values[3],
                        'NI': values[4],
                        'VIRT': values[5],
                        'RES': values[6],
                        'SHR': values[7],
                        'S': values[8],
                        '%CPU': values[9],
                        '%MEM': values[10],
                        'TIME+': values[11],
                        'COMMAND': ' '.join(values[12:])
                    }
                    parsed_logs.append(log_object)
                    
                    if log_object['listing'] == 'BLACKLISTED':
                        blacklisted_count += 1
                    elif log_object['listing'] == 'WHITELISTED':
                        whitelisted_count += 1
        
        return jsonify({'logs': parsed_logs, 'blacklisted_count': blacklisted_count, 'whitelisted_count': whitelisted_count})
    
    except Exception as e:
        return jsonify({'error': str(e)})

# @app.route('/download_all_files')
# def download_all_files():
#     BUCKET_NAME = 'ostelemetry1'
#     KEY_LIST = [
#         "output/logs_network.txt", 
#         "output/logs_file.txt", 
#         "output/logs_ioping.txt", 
#         "output/logs_iostat.txt", 
#         "output/logs_iotop.txt", 
#         "output/logs_kernel.txt", 
#         "output/logs_liveprocess.txt", 
#         "output/logs_memmap.txt", 
#         "output/logs_memory.txt", 
#         "output/logs_sar.txt", 
#         "output/logs_processinfo.txt"
#     ]
    
#     DOWNLOADS_DIR = 'D:\SEMESTER_8\project\Linux_Sentinel\backend\downloads'

#     try:
#         s3 = boto3.client('s3')
#         for key in KEY_LIST:
#             filename = key.split('/')[-1]
#             local_file_path = f'{DOWNLOADS_DIR}{filename}'
#             s3.download_file(BUCKET_NAME, key, local_file_path)
            
#             zf = zipfile.ZipFile("myzipfile.zip", "w")
#             for dirname, subdirs, files in os.walk("downloads"):
#                 zf.write(dirname)
#                 for filename in files:
#                     zf.write(os.path.join(dirname, filename))
#             zf.close()
#         return send_file("myzipfile.zip",  mimetype='application/zip', as_attachment=True, download_name="myzipfile.zip")
#     except Exception as e:
#         return str(e)
@app.route('/download_all_files')
def download_all_files():
    BUCKET_NAME = 'ostelemetry1'
    KEY_LIST = [
        "output/logs_network.txt", 
        "output/logs_file.txt", 
        "output/logs_ioping.txt", 
        "output/logs_iostat.txt", 
        "output/logs_iotop.txt", 
        "output/logs_kernel.txt", 
        "output/logs_liveprocess.txt", 
        "output/logs_memmap.txt", 
        "output/logs_memory.txt", 
        "output/logs_sar.txt", 
        "output/logs_processinfo.txt"
    ]
    
    DOWNLOADS_DIR = r'D:\SEMESTER_8\project\Linux_Sentinel\backend\downloads'  # Use raw string to avoid escaping

    try:
        # Create a zip file
        with zipfile.ZipFile("myzipfile.zip", "w") as zf:
            s3 = boto3.client('s3')
            for key in KEY_LIST:
                filename = key.split('/')[-1]
                local_file_path = os.path.join(DOWNLOADS_DIR, filename)  # Correct path concatenation
                s3.download_file(BUCKET_NAME, key, local_file_path)
                
                # Add file to the zip
                zf.write(local_file_path, filename)
        
        # Send the zip file as response
        return send_file("myzipfile.zip",  mimetype='application/zip', as_attachment=True, download_name="myzipfile.zip")
    
    except Exception as e:
        return str(e)

        
if __name__ == '__main__':
    app.run(debug=True)


