import User from "@/models/userModel";
import nodemailer from "nodemailer";
import brcyptjs from "bcryptjs";

export const sendMail = async ({email, emailType, userId}:any) => {
  try {

    const hashedToken = await brcyptjs.hash(userId.toString(), 10);

    if(emailType === 'VERIFY'){
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpire: Date.now() + 3600000, 
      })
    }else if(emailType === 'RESET'){
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpires: Date.now() + 3600000,
      })

    }

    const transporter = nodemailer.createTransport({
      host: "",
      port: 465,
      secure: true,
      auth: {
        user: "",
        pass: "",
      },
    })

    const mailOptions = {
      from: "something@gmail.com",
      to: email,
      subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
     }

     const mailResponse = await transporter.sendMail(mailOptions)

     return mailResponse
  } catch (error) {
    console.log("Something went wrong while sending the email.")
    console.log(error)
  }
}