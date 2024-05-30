import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';
import { send } from 'process';

import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(req:Request) {  
  await dbConnect();

  try {
    
    const { username, email, password } = await req.json();
    
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true
    })

    if(existingVerifiedUser){
      return Response.json({ success: false, message: 'User already exists' }, {
        status: 400
      });
    }

    const existingUserByEmail = await UserModel.findOne({
      email
    })

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if(existingUserByEmail){
      if(existingUserByEmail.isVerified){
        return Response.json({ success: false, message: 'User already exists with this email ' }, {
          status: 400
        });
      }else{
        const hashedPassword = await bcrypt.hash(password, 12);
        const expiryDate = new Date();
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifiedCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }

    }else{
      const hashedPassword = await bcrypt.hash(password, 12);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode, 
        verifiedCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: []
      });

      await newUser.save();
    }

    //TRY: Send verification email to user
    const emailResponse = await sendVerificationEmail(
      email, 
      username,
      verifyCode
    );

    if(!emailResponse.success){
      return Response.json({ success: false, message: emailResponse.message }, {
        status: 500
      });
    }

    return Response.json({ success: true, message: 'User created' }, { status: 200 });

  } catch (error) {
    console.error('Error signing up: ', error);
    return Response.json({ success: false, message: 'Error signing up' }, {
      status: 500
    });
  }
}