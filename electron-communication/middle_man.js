const rclnodejs = require('rclnodejs');

async function main() 
{
    await rclnodejs.init(); // Setup rclnodejs for ROS 2 communication

    // Create middle man node (Contains publishers & subscribers)
    const node = new rclnodejs.Node('middle_man_node');
    
    //-----------------------------------------------------------------------------------------
    // Create Publishers - To Jetson
    const topic_jetson_light = 'light';
    const LightMessage = rclnodejs.require('wheelchair_sensor_msgs/msg/Light');
    const lightPublisher = node.createPublisher(LightMessage, topic_jetson_light);

    const topic_jetson_lidar = 'lidar';
    const lidarMessage = rclnodejs.require('wheelchair_sensor_msgs/msg/Lidar');
    const lidarPublisher = node.createPublisher(lidarMessage, topic_jetson_lidar);

    const topic_jetson_brake = 'ebrake';
    const brakeMessage = rclnodejs.require('wheelchair_sensor_msgs/msg/Brake');
    const brakePublisher = node.createPublisher(brakeMessage, topic_jetson_brake);
    
    //-----------------------------------------------------------------------------------------
    // Battery Percent Publisher / Subscriber - Sub to Jetson - Publish to Electron 
    const messageString = 'std_msgs/msg/String';
    
    const topic_electron_battery = 'electron_battery';
    const batteryPublisher = node.createPublisher(messageString, topic_electron_battery);

    const topic_jetson_battery = 'battery_status';
    node.createSubscription('wheelchair_sensor_msgs/msg/Battery', topic_jetson_battery, (msg) => {
        // Format battery percent int to a string
        batteryString = msg.battery_percent + "%"
        console.log(`Received from Jetson: ${batteryString}`);
    
        batteryPublisher.publish(batteryString);
        console.log(`---> Published to Electron: ${batteryString}`);
    });

    //-----------------------------------------------------------------------------------------
    // Speed Subscriber - Sub to Jetson - Tell Electron to update speed display
    const topic_electron_speed = 'electron_speed';
    const speedPublisher = node.createPublisher(messageString, topic_electron_speed);

    const topic_jetson_speed = 'motor_speed';
    node.createSubscription('wheelchair_sensor_msgs/msg/RefSpeed', topic_jetson_speed, (msg) => {
        // Format battery percent int to a string
        speedString = msg.left_speed + " | " + msg.right_speed
        console.log(`Received from Jetson: ${speedString}`);
    
        speedPublisher.publish(speedString);
        console.log(`---> Published to Electron: ${speedString}`);
    });

    //-----------------------------------------------------------------------------------------
    // Light Subscriber - Sub to Electron - Tell Jetson to turn on/off light
    node.createSubscription('std_msgs/msg/String', 'electron_light', (msg) => {
        console.log(`Received from Electron app: ${msg.data}`);

        // Publish custom messages
        // Light Mode
        if(msg.data == 'LIGHT_STEADY') 
        {
            // uint8 STEADY=1
            const message = { state: 1 };
            lightPublisher.publish(message);
            console.log(`---> Published custom light message: ${message.state}`);
        } 
        else if (msg.data == 'LIGHT_FLASHING') 
        {
            // uint8 FLASH=2
            const message = { state: 2 };
            lightPublisher.publish(message);
            console.log(`---> Published custom light message: ${message.state}`);
        } 
        else 
        {
            // uint8 OFF=0
            const message = { state: 0 };
            lightPublisher.publish(message);
            console.log(`---> Published custom light message: ${message.state}`);
        }
    });

    //-----------------------------------------------------------------------------------------
    // LiDAR Subscriber - Sub to Electron - Tell Jetson to turn on/off LiDAR
    node.createSubscription('std_msgs/msg/String', 'electron_lidar', (msg) => {
        console.log(`Received from Electron app: ${msg.data}`);

        // Publish custom messages
        if(msg.data == 'LIDAR_ON') 
        {
            // Lidar ON
            const message = { state: 1 };
            lidarPublisher.publish(message);
            console.log(`---> Published custom lidar message: ${message.state}`);
        }
        else 
        {
            // Lidar OFF
            const message = { state: 0 };
            lidarPublisher.publish(message);
            console.log(`---> Published custom lidar message: ${message.state}`);
        }
    });

    //-----------------------------------------------------------------------------------------
    // Brake Subscriber - Sub to Electron - Tell Jetson to turn on/off brake
    node.createSubscription('std_msgs/msg/String', 'electron_brake', (msg) => {
        console.log(`Received from Electron app: ${msg.data}`);

        // Publish custom messages
        if(msg.data == 'BRAKE_ON') 
        {
            // Brake ON
            const message = { brake: true };
            brakePublisher.publish(message);
            console.log(`---> Published custom brake message: ${message.brake}`);
        }
        else 
        {
            // Brake OFF
            const message = { brake: false };
            brakePublisher.publish(message);
            console.log(`---> Published custom brake message: ${message.brake}`);
        }
    });

    node.spin();

    console.log(`Waiting to recieve data...`);
}
main().catch(console.error);