import mongoose from "mongoose";

export async function dbConnect() {
  try {
    mongoose.connect(process.env.MONGO_URI!)
    const connection = mongoose.connection

    connection.on('connected', () => {
      console.log("Connected to the database.")
    })

    connection.on('error', (error) => {
      console.log("An error occurred while connecting to the database.")
      console.log(error)
      process.exit();
    })
  } catch (error) {
    console.log("Something went wrong while connecting to the database.")
    console.log(error)
  }
}