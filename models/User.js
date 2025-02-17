const mongoose = require("mongoose");

const userSkillSchema = new mongoose.Schema({
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true,
  },
  type: { type: String, enum: ["hard", "soft"], required: true },
  status: {
    type: String,
    enum: ["self-assigned", "confirmed", "pending"],
    default: "self-assigned",
  },
});

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
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },
    settings: {
      courses: { type: Boolean, default: false },
      students: { type: Boolean, default: false },
      teachers: { type: Boolean, default: false },
      questions: { type: Boolean, default: false },
      statistics: { type: Boolean, default: false },
    },
    theme: { type: String, default: "light" },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: [userSkillSchema],
    certifications: [{ type: String }],
    achievements: [{ title: String, description: String, date: Date }], // Оновлено для зберігання докладної інформації
    badges: [
      { title: String, description: String, icon: String, awardedAt: Date },
    ],

    roadmap: [
      {
        category: { type: String, required: true },
        subcategories: [
          {
            name: { type: String, required: true },
            goals: [
              {
                title: { type: String, required: true },
                description: { type: String },
                completed: { type: Boolean, default: false },
              },
            ],
          },
        ],
      },
    ],

    cv: {
      summary: { type: String, default: "" },
      experience: [{ company: String, role: String, duration: String }],
      education: [{ institution: String, degree: String, year: String }],
      skills: [{ type: String }],
    },
    assignedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);



module.exports = mongoose.model("User", userSchema);
