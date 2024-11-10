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

// Отримати профіль користувача з новими полями та заповненням навичок
router.get("/:id/profile", getUser, async (req, res) => {
  try {
    // Зберігаємо всю логіку для наявних полів, але додаємо заповнення для навичок
    const user = await User.findById(req.params.id)
      .populate({
        path: "skills.skillId",
        model: "Skill",
        select: "name type", // Вибірково заповнюємо лише назву та тип навички
      });

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    // Формуємо об'єкт для відповіді, включаючи всі наявні поля
    res.json({
      name: user.name,
      email: user.email,
      bio: user.bio,
      skills: user.skills, // Тепер skills включає навички з назвою та типом
      certifications: user.certifications,
      achievements: user.achievements,
      roadmap: user.roadmap,
      cv: user.cv,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка при завантаженні профілю" });
  }
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
    try {
      const { avatarUrl } = req.body;
      res.user.avatar = avatarUrl;
      await res.user.save();
      res.json({ avatar: res.user.avatar });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


// Отримати призначені курси студента
router.get("/:id/assigned-courses", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("assignedCourses");
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }
    res.json(user.assignedCourses);
  } catch (error) {
    console.error("Помилка при завантаженні призначених курсів:", error);
    res
      .status(500)
      .json({ message: "Помилка при завантаженні призначених курсів" });
  }
});




router.patch("/:id/assign-courses", getUser, async (req, res) => {
  const { courseIds } = req.body; // Отримуємо масив ID курсів
  if (!Array.isArray(courseIds)) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
    res.user.assignedCourses = courseIds; // Призначаємо курси
    const updatedUser = await res.user.save();
    res.json({ assignedCourses: updatedUser.assignedCourses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





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

  // Отримати кількість студентів
router.get("/count/students", async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: "student" });
    res.json({ count: studentCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Отримати кількість вчителів
router.get("/count/teachers", async (req, res) => {
  try {
    const teacherCount = await User.countDocuments({ role: "teacher" });
    res.json({ count: teacherCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/skills", async (req, res) => {
  const { name, type, status } = req.body;
  const newSkill = { name, type, status, createdAt: new Date() };
  try {
    const user = await User.findById(req.user._id); // Припущення, що є авторизація
    user.skills.push(newSkill);
    await user.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Отримати навички студента з назвою та типом навичок
router.get("/:id/skills", getUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "skills.skillId",
      model: "Skill",
      select: "name type",
    });

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    res.json(user.skills); // Повертаємо масив навичок з деталями
  } catch (error) {
    res.status(500).json({ message: "Помилка при завантаженні навичок студента" });
  }
});


// Додати навичку користувачеві
router.post("/:id/skills", getUser, async (req, res) => {
  const { skillId, type, status } = req.body;

  try {
    const skill = { skillId, type, status }; // Об'єкт навички для додавання
    res.user.skills.push(skill); // Додаємо навичку до списку користувача
    await res.user.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: "Помилка при додаванні навички користувачеві" });
  }
});

// Оновлення статусу навички користувача
router.patch("/:id/skills/:skillId", getUser, async (req, res) => {
  const { status } = req.body; // Отримуємо новий статус з тіла запиту

  try {
    // Знаходимо навичку за її ID в масиві навичок користувача
    const skill = res.user.skills.id(req.params.skillId);

    if (!skill) {
      return res.status(404).json({ message: "Навичку не знайдено" });
    }

    skill.status = status; // Оновлюємо статус навички
    await res.user.save(); // Зберігаємо зміни користувача

    res.json(skill); // Відправляємо оновлену навичку у відповідь
  } catch (error) {
    res.status(500).json({ message: "Помилка при оновленні навички" });
  }
});



// Видалити навичку
router.delete("/skills/:id", async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Припущення, що є авторизація
    user.skills = user.skills.filter((skill) => skill._id.toString() !== req.params.id);
    await user.save();
    res.status(204).send();
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

module.exports = router;
