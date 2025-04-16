const rclnodejs = require('rclnodejs');

async function main() 
{
    await rclnodejs.init(); // Setup rclnodejs for ROS 2 communication

    // Create middle man node (Contains publishers & subscribers)
    const node = new rclnodejs.Node('middle_man_node');

    // Create Publishers
    const LightMessage = rclnodejs.require('wheelchair_sensor_msgs/msg/Light');
    const lightPublisher = node.createPublisher(LightMessage, 'light');

    const lidarMessage = rclnodejs.require('wheelchair_sensor_msgs/msg/Lidar');
    const lidarPublisher = node.createPublisher(lidarMessage, 'lidar');

    const brakeMessage = rclnodejs.require('wheelchair_sensor_msgs/msg/Brake');
    const brakePublisher = node.createPublisher(brakeMessage, 'eBrake');

    console.log(`Waiting to recieve data...`);

    //-----------------------------------------------------------------------------------------
    // Light Subscriber
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
    // LiDAR Subscriber
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
    // Brake Subscriber
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
}
main().catch(console.error);