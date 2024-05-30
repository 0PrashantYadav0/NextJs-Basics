import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/User";

export async function GET(reqest: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const userFromSession: User = session?.user;

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        {
          status: 401,
        }
      );
    }

    const userId = new mongoose.Types.ObjectId(userFromSession._id);

    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User Not Found",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error Getting User", error);
    return Response.json(
      {
        success: false,
        message: "Error Getting User",
      },
      {
        status: 500,
      }
    );
  }
}
