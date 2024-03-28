import { dbConnect } from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import { sendMail } from "@/helper/mailer";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { email, password, username } = reqBody;
    if (!email || !password || !username) {
      return NextResponse.json({ error: "Please fill in all the fields." }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if(user){
      return NextResponse.json({ error: "User already exists." }, { status: 400 });
    }

    const salt = await bcryptjs.genSalt(11);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    //send verification mail
    await sendMail({email, emailType: "VERIFY", userId : savedUser._id})


    return NextResponse.json({ message: "User registered successfully.",
    status: 201,
    savedUser
   });

  } catch (error:any) {
    console.log("Something went wrong while logging in.")
    return NextResponse.json({ error: error.message,
      status : 500})
  }
}