WELCOME TO OS TELEMETRY 

TO RUN THE TOOL YOU NEED TO PERFORM THE FOLLOWING OPERATIONS :
1) Navigate to the requirement folder and run the prerequisite.sh file.
2) Open the cloud folder, copy the server.py file and the config.json file to your EC2 instance. 
3) On your EC2 instance, install python3, pip, boto3(python library) according to your linux. 
4) Enter the credentials of your S3 bucket in the config.json file. 
5) Run the server.py file.
5) To run the tool,Check if the server.py is active and running. 
6) Once done, open the SERVICEFILE folder, Fill the config.json file for the IPs and process to be whitelisted.
7) Run the servicev2.sh file(Note: all the bash files should be in the same folder).
8) Enter the input that'll be prompted to you by the tool:
	1) Public IP of your EC2 instance
	2) Enter the prompted details
	3) Enter the network interface that you want to monitor