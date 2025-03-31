
# Frontend

## ECE 492 Senior Design Frontend Code

This repository contains the frontend code for the ECE 492 Senior Design project. 

The application is built using the Electron Framework and communicates via ROS 2.

## Environment Setup for Linux

### 0. Git & ROS 2 Setup

To set up the application, you need to clone the following GitHub repositories:

- **Frontend** (this repository)
- **wheelchair_sensor_msgs** (custom ROS 2 messages repository)

Ensure that ROS 2 is installed on your Linux environment. The required version is **Ubuntu 22.04**.

To check your Ubuntu version, run:

```sh
lsb_release -a
```

Once you have cloned the custom messages repository, navigate into it and build it using:

```sh
colcon build
```

To verify the custom messages, use:

```sh
ros2 interface show wheelchair_sensor_msgs/msg/MessageName
```

### 1. Basic Setup

From the root directory, install Node.js and npm:

```sh
sudo apt install nodejs
sudo apt install npm
```

Check the installed versions:

```sh
nodejs -v  # Should be 12.22.9
npm -v     # Should be 11.2.0
```

### 2. Electron App Setup

Navigate into the app directory:

```sh
cd test-app
```

Install dependencies:

```sh
npm install
```

This should generate the `node_modules` directory and `package-lock.json`.

Rebuild `rclnodejs` for Electron (must be run after every `npm install`):

```sh
./node_modules/.bin/electron-rebuild
```

### 3. Communication Setup

Navigate into the `electron-communication` directory:

```sh
cd electron-communication
```

Install `rclnodejs`:

```sh
npm install rclnodejs
```

### 4. Sourcing

Add the following lines to your `.bashrc` file to source ROS 2 Humble and custom messages:

```sh
source /opt/ros/humble/setup.bash
source ~/ros2_ws/install/setup.bash
```
### 5. Running App

Navigate into the `electron-communication` directory and run:

```sh
node middle_man.js
```

Navigate into the `test-app` directory and run:

```sh
npm start
```

Note that both need to be running in parallel. 

Also, `npm start` might throw some errors upon app launch, but those can be ignored. 

## Electron App Structure

- `test-app/` - Contains the main Electron application.
