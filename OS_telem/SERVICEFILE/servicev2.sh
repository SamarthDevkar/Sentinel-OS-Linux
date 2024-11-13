#!/bin/bash
sudo echo "Welcome to OS Telemetry"

while true; do
    read -p "Enter the IP address: " ip_address

    # Validate IP address
    if [[ $ip_address =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        break  # Exit the loop if a valid IP address is provided
    else
        echo "Invalid IP address format. Please enter a valid IP address."
    fi
done

run_all_sh_files() {
    sh_files=($(ls *.sh | grep -vE "servicev2\.sh|service\.sh"))

    if [ ${#sh_files[@]} -eq 0 ]; then
        echo "No eligible .sh files found."
        exit 1
    fi

    for ((i = 0; i < ${#sh_files[@]}; i++)); do
        sudo chmod +x "${sh_files[$i]}"
        sleep 3
        if [ "${sh_files[$i]}" == "memmapshlib.sh" ]; then
            sudo "./${sh_files[$i]}" "$ip_address" &
        elif [ "${sh_files[$chosen_num]}" == "Kernel.sh" ]; then
            sudo "./${sh_files[$chosen_num]}" "$ip_address" &
                    else
            sudo "./${sh_files[$i]}" "$ip_address" &
        fi
    done
}

list_and_run_sh_files() {
    sh_files=($(ls *.sh | grep -vE "copy\.sh|service\.sh|servicev2\.sh"))

    if [ ${#sh_files[@]} -eq 0 ]; then
        echo "No eligible .sh files found."
        exit 1
    fi

    echo "Available .sh files:"
    for i in "${!sh_files[@]}"; do
        echo "$i: ${sh_files[$i]}"
    done

    read -p "How many shell files do you want to run? " num_to_run

    if [ $num_to_run -lt 1 ] || [ $num_to_run -gt ${#sh_files[@]} ]; then
        echo "Invalid input. Exiting."
        exit 1
    fi

    for ((i = 1; i <= num_to_run; i++)); do
        read -p "Which shell files do you want to run ranging from (0-${#sh_files[@]}): " chosen_num
        chosen_num=$((chosen_num))
        sleep 3
        if [ "${sh_files[$chosen_num]}" == "Kernel.sh" ]; then
            sudo "./${sh_files[$chosen_num]}" "$ip_address" &
        elif [ "${sh_files[$chosen_num]}" == "Network.sh" ]; then
            sudo "./${sh_files[$chosen_num]}" "$ip_address" &
        elif [ "${sh_files[$chosen_num]}" == "memmapshlib.sh" ]; then
            sudo "./${sh_files[$chosen_num]}" "$ip_address"&
        else
            sudo "./${sh_files[$chosen_num]}" "$ip_address" &
        fi
    done
}


echo "1. Run specific tools"
echo "2. Run all tools"
read -p "Choose an option (1/2): " option

case $option in
    1) list_and_run_sh_files ;;
    2) run_all_sh_files ;;
    *) echo "Invalid option. Exiting." ;;
esac

wait
