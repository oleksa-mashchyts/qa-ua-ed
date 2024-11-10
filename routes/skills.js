const express = require("express");
const router = express.Router();
const Skill = require("../models/Skill");

// Отримати всі навички
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Помилка при завантаженні навичок" });
  }
});

// Додати нову навичку
router.post("/", async (req, res) => {
  const { name, type, status } = req.body;
  const newSkill = new Skill({ name, type, status });
  try {
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(500).json({ message: "Помилка при додаванні навички" });
  }
});

// Оновити навичку
router.put("/:id", async (req, res) => {
  const { name, type, status } = req.body;
  try {
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, type, status },
      { new: true }
    );
    if (!updatedSkill) {
      return res.status(404).json({ message: "Навичку не знайдено" });
    }
    res.json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: "Помилка при оновленні навички" });
  }
});

// Видалити навичку
router.delete("/:id", async (req, res) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
    if (!deletedSkill) {
      return res.status(404).json({ message: "Навичку не знайдено" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Помилка при видаленні навички" });
  }
});

module.exports = router;
