const rclnodejs = require('rclnodejs');

async function main() 
{
    await rclnodejs.init(); // Setup rclnodejs for ROS 2 communication

    // Create middle man node (Contains publishers & subscribers)
    const node = new rclnodejs.Node('middle_man_node');

    // Light State
    const LightMessage = rclnodejs.require('wheelchair_sensor_msgs/msg/Light'); // Custom message path
    const lightPublisher = node.createPublisher(LightMessage, 'light_topic'); // Create a publisher

    console.log(`Waiting to recieve data...`);

    // Create a subscriber that reads Electron app
    node.createSubscription('std_msgs/msg/String', 'electron_light', (msg) => {
        console.log(`Received from Electron app: ${msg.data}`);

        
        // const message = { state: 1 };
        // lightPublisher.publish(message);
        // console.log(`Published custom light message: ${message.state}`);

        // Publish custom messages
        // Light Mode
        if(msg.data == 'steady') 
        {
            // uint8 STEADY=1
            const message = { state: 1 };
            lightPublisher.publish(message);
            console.log(`---> Published custom light message: ${message.state}`);
        } 
        else if (msg.data == 'flashing') 
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

    node.spin();
}
main().catch(console.error);