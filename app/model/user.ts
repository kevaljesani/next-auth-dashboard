import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: String,
  password: String,
});

const User = models.User || model("User", UserSchema, "user"); // 👈 force collection name

export default User;