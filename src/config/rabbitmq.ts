
import amqp from "amqplib";

let connection: amqp.ChannelModel;
let channel: amqp.Channel;

export async function connectRabbitMQ() {
    try {
        const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

        connection = await amqp.connect(RABBITMQ_URL);

        channel = await connection.createChannel();

        await channel.assertQueue("forgot-password-email", { durable: true });

        console.log("Successfully connected to RabbitMQ");

    } catch (error) {

        console.error("Failed to connect to RabbitMQ:", error);
    }
}

export function getChannel() {
    if (!channel) {
        throw new Error("RabbitMQ channel is not initialized yet!");
    }
    return channel;
}


export async function closeRabbitMQ() {
    try {
        if (channel) {
            await channel.close();
            console.log("Rabbit MQ channel is closed")
        }
        if (connection) {
            await connection.close();
            console.log("Rabbit MQ connection is closed")
        }
    } catch (error) {
        console.log(error)
    }
}







