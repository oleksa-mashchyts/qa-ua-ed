console.log("Файл users.js завантажено");

const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

router.get("/", (req, res) => {
  res.send("Маршрут /api/users працює");
});

// Реєстрація нового користувача
router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Отримати профіль користувача з новими полями
router.get("/:id/profile", getUser, (req, res) => {
  res.json({
    name: res.user.name,
    email: res.user.email,
    bio: res.user.bio,
    skills: res.user.skills,
    certifications: res.user.certifications,
    achievements: res.user.achievements,
    roadmap: res.user.roadmap,
    cv: res.user.cv,
    avatar: res.user.avatar,
  });
});

// Оновити профіль користувача
router.patch("/:id/profile", getUser, async (req, res) => {
  const {
    name,
    bio,
    email,
    skills,
    certifications,
    achievements,
    roadmap,
    cv,
  } = req.body;
  try {
    if (name !== undefined) res.user.name = name;
    if (bio !== undefined) res.user.bio = bio;
    if (email !== undefined) res.user.email = email;
    if (skills) res.user.skills = skills;
    if (certifications) res.user.certifications = certifications;
    if (achievements) res.user.achievements = achievements;
    if (roadmap) res.user.roadmap = roadmap;
    if (cv) res.user.cv = cv;

    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Отримати всіх студентів
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Отримати всіх вчителів
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Отримати профіль користувача
router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});

// Оновлення теми користувача
router.patch("/:id/theme", async (req, res) => {
  try {
    const { theme } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { theme },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

  router.patch("/:id/avatar", getUser, async (req, res) => {
    console.log("Запит отримано");
    console.log("PATCH request received for avatar update:", req.params.id);
    try {
      const { avatarUrl } = req.body;
      res.user.avatar = avatarUrl;
      await res.user.save();
      res.json({ avatar: res.user.avatar });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Middleware для отримання користувача по ID
async function getUser(req, res, next) {
  console.log("Отримання користувача з ID:", req.params.id);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}



// Отримати досягнення користувача
router.get("/:id/achievements", getUser, (req, res) => {
  res.json(res.user.achievements);
});

// Оновити досягнення користувача
router.patch("/:id/achievements", getUser, async (req, res) => {
  try {
    res.user.achievements = req.body.achievements;
    const updatedUser = await res.user.save();
    res.json(updatedUser.achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Отримати бейджі користувача
router.get("/:id/badges", getUser, (req, res) => {
  res.json(res.user.badges);
});

// Оновити бейджі користувача
router.patch("/:id/badges", getUser, async (req, res) => {
  try {
    res.user.badges = req.body.badges;
    const updatedUser = await res.user.save();
    res.json(updatedUser.badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Функція для перевірки умов і присвоєння бейджів
async function assignBadge(user, condition, badgeData) {
  // Перевіряємо, чи користувач вже має бейдж
  const existingBadge = user.badges.find(
    (badge) => badge.title === badgeData.title
  );
  if (existingBadge) return false;

  const badgeCompletionCondition = (user) => user.completedCourses?.length >= 5;

  const courseCompletionBadge = {
    title: "Course Master",
    description: "За завершення 5 курсів",
    icon: "/icons/course-master.png",
  };

  const skillsCondition = (user) => user.skills.length >= 10;

  const skillsBadge = {
    title: "Skill Pro",
    description: "За додавання 10 навичок",
    icon: "/icons/skill-pro.png",
  };

  const activityCondition = (user) => {
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);
    return user.lastLogin && user.lastLogin >= lastMonth;
  };

  const activityBadge = {
    title: "Active User",
    description: "За активне використання платформи протягом 30 днів",
    icon: "/icons/active-user.png",
  };

  // Виклик після завершення курсу користувачем - ПЕРНЕСТИ У МІСЦЕ(ФАЙЛ), ДЕ БУДЕ ПЕРЕВІРЯТИСЯ ЗАКІНЧЕННЯ КУРСУ
  async function completeCourse(user) {
    user.completedCourses = user.completedCourses
      ? user.completedCourses + 1
      : 1;
    await user.save();

    // Перевірка та присвоєння бейджів
    await assignBadge(user, badgeCompletionCondition, courseCompletionBadge);
    await assignBadge(user, skillsCondition, skillsBadge);
    await assignBadge(user, activityCondition, activityBadge);
  }



  // Маршрут для перевірки та надання бейджів
  router.post("/:id/badges/assign", getUser, async (req, res) => {
    try {
      const user = res.user;

      // Виконати перевірку та присвоєння бейджів
      const courseBadgeAssigned = await assignBadge(
        user,
        badgeCompletionCondition,
        courseCompletionBadge
      );
      const skillsBadgeAssigned = await assignBadge(
        user,
        skillsCondition,
        skillsBadge
      );
      const activityBadgeAssigned = await assignBadge(
        user,
        activityCondition,
        activityBadge
      );

      res.json({
        badgesAssigned: {
          course: courseBadgeAssigned,
          skills: skillsBadgeAssigned,
          activity: activityBadgeAssigned,
        },
        badges: user.badges,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Перевірка умови для присвоєння бейджа
  const conditionMet = condition(user);
  if (conditionMet) {
    user.badges.push({
      ...badgeData,
      awardedAt: new Date(),
    });
    await user.save();
    return true;
  }
  return false;
}

// Отримати roadmap користувача
router.get("/:id/roadmap", getUser, (req, res) => {
  res.json(res.user.roadmap);
});

// Оновити roadmap користувача
router.patch("/:id/roadmap", getUser, async (req, res) => {
  try {
    res.user.roadmap = req.body.roadmap;
    const updatedUser = await res.user.save();
    res.json(updatedUser.roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Додати в users.js маршрут для отримання налаштувань користувача
router.get("/:id/settings", getUser, (req, res) => {
  res.json({ settings: res.user.settings });
});

// Додати маршрут для оновлення налаштувань
router.patch("/:id/settings", getUser, async (req, res) => {
  const { settings } = req.body;
  try {
    res.user.settings = settings;
    const updatedUser = await res.user.save();
    res.json({ settings: updatedUser.settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
