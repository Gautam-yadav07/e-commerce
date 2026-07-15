import { getChannel } from "../config/rabbitmq.js";
import sgMail from "../config/sendGrid.js";


export const startEmailWorker = async () => {

  const channel = getChannel();

  channel.consume(

    "forgot-password-email",

    async (message) => {

      if (!message) return;

      try {

        const data = JSON.parse(message.content.toString());
         console.log(process.env.SENDGRID_FROM_EMAIL!)


        const resetLink =
          `${process.env.BACKEND_URL}/reset-password?token=${data.token}`;
        console.log(resetLink)

        await sgMail.send({

          to: data.email,

          from: process.env.SENDGRID_FROM_EMAIL!,
         
          subject: "Reset Your Password",

          html: `
              <h2>Password Reset Request</h2>

              <p>Hello <b>${data.name}</b>,</p>

              <p>
                We received a request to reset your password.
              </p>

              <p>
                Click the button below to reset your password.
              </p>

              <a
                href="${resetLink}">
                Reset Password
              </a>


              <p>
                This link will expire in <b>15 minutes</b>.
              </p>
            `

        });

        channel.ack(message);

      } catch (error) {

        console.error(error);

        channel.nack(message, false, true);

      }

    }

  );

};
