#!/bin/bash

# This script will ask for an e-mail adress, database username, database name and give an option list of the running docker container name and ask for the
# number that corresponds to the name of the container and then executes a psql command to mark the user as administrator
# in the database of the selected container.

# Check if the script is run as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root"
    exit 1
fi

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker and try again."
    exit 1
fi

# Ask for the e-mail address
read -p "Enter the e-mail address of the user to be marked as administrator: " email
# Check if the e-mail address is valid
if ! [[ "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
    echo "❌ Invalid e-mail address. Please enter a valid e-mail address."
    exit 1
fi

# Ask for the database username
read -p "Enter the database username: " db_username
# Ask for the database name
read -p "Enter the database name: " db_name

# Get the list of running docker containers
containers=$(docker ps --format "{{.Names}}")
# Check if there are any running containers
if [ -z "$containers" ]; then
    echo "❌ No running docker containers found."
    exit 1
fi

# Display the list of running containers
echo "Select the docker container to mark the user as administrator:"
select container in $containers; do
    if [ -n "$container" ]; then
        break
    else
        echo "❌ Invalid selection. Please try again."
    fi
done

# Check if the selected container is running
if ! docker ps --format "{{.Names}}" | grep -q "^$container$"; then
    echo "❌ The selected container is not running."
    exit 1
fi

# Run the command
docker exec -it "$container" psql -U "$db_username" -d "$db_name" -c "UPDATE \"User\" SET admin = true WHERE email = '$email';"
# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "✅ User with e-mail address $email has been marked as administrator in the database $db_name of the container $container."
else
    echo "❌ Failed to mark the user as administrator. Please check the database connection and try again."
fi