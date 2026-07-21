import { getChannel } from "../config/rabbitmq.js";

export interface ForgotPasswordEmail{

    email:string;

    name:string;

    token:string;
}

export const publishForgotPasswordEmail = async(
    data:ForgotPasswordEmail
)=>{
  console.log(data)
    const channel = getChannel();

    channel.sendToQueue("forgot-password-email", Buffer.from(JSON.stringify(data)),
    
      {
          persistent:true
      }

    );

}
