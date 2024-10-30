const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Забезпечує унікальність імейлу
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Мінімальна довжина пароля
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },
    theme: { type: String, default: "light" },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
