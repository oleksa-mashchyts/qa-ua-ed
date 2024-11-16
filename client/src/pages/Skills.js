import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { format } from "date-fns";
import axios from "axios";

const Skills = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [skills, setSkills] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [skillData, setSkillData] = useState({
    name: "",
    type: "hard",
    status: "active",
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get("/api/skills");
      setSkills(response.data);
    } catch (error) {
      console.error("Помилка при завантаженні навичок:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event, skill) => {
    setAnchorEl(event.currentTarget);
    setSelectedSkill(skill);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSkill(null);
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await axios.delete(`/api/skills/${skillId}`);
      setSkills(skills.filter((skill) => skill._id !== skillId));
      handleMenuClose();
    } catch (error) {
      console.error("Помилка при видаленні навички:", error);
    }
  };

  const handleDialogOpen = (skill = null) => {
    if (skill) {
      setSkillData({
        name: skill.name,
        type: skill.type,
        status: skill.status,
      });
      setSelectedSkill(skill);
    } else {
      setSkillData({ name: "", type: "hard", status: "active" });
      setSelectedSkill(null);
    }
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSkillData({ name: "", type: "hard", status: "active" });
  };

  const handleSaveSkill = async () => {
    try {
      if (selectedSkill) {
        // Оновлення навички
        const response = await axios.put(
          `/api/skills/${selectedSkill._id}`,
          skillData
        );
        setSkills(
          skills.map((skill) =>
            skill._id === selectedSkill._id ? response.data : skill
          )
        );
      } else {
        // Додавання нової навички
        const response = await axios.post("/api/skills", skillData);
        setSkills([...skills, response.data]);
      }
      handleDialogClose();
    } catch (error) {
      console.error("Помилка при збереженні навички:", error);
    }
  };

  const filteredSkills = skills.filter(
    (skill) => skill.type === (activeTab === 0 ? "hard" : "soft")
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Навички
      </Typography>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Hard Skills" />
        <Tab label="Soft Skills" />
      </Tabs>

      <Button
        variant="contained"
        onClick={() => handleDialogOpen()}
        sx={{ mt: 2 }}
      >
        Додати навичку
      </Button>

      <Box sx={{ maxWidth: 1600, margin: "auto", mt: 3 }}>
        <Paper>
    
            <Table>
              <TableHead className="table-header">
                <TableRow>
                  <TableCell>Назва</TableCell>
                  <TableCell>Тип</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Дата створення</TableCell>
                  <TableCell align="right">Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSkills.map((skill) => (
                  <TableRow key={skill._id}>
                    <TableCell>{skill.name}</TableCell>
                    <TableCell>
                      {skill.type === "hard" ? "Hard Skill" : "Soft Skill"}
                    </TableCell>
                    <TableCell>{skill.status}</TableCell>
                    <TableCell>
                      {format(new Date(skill.createdAt), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleMenuOpen(e, skill)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={() => handleDialogOpen(selectedSkill)}
                        >
                          Редагувати
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleDeleteSkill(selectedSkill._id)}
                        >
                          Видалити
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
       
        </Paper>
      </Box>
      {/* Діалогове вікно для додавання/редагування навички */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {selectedSkill ? "Редагувати навичку" : "Додати навичку"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Назва"
            fullWidth
            value={skillData.name}
            onChange={(e) =>
              setSkillData({ ...skillData, name: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Тип</InputLabel>
            <Select
              native
              value={skillData.type}
              onChange={(e) =>
                setSkillData({ ...skillData, type: e.target.value })
              }
            >
              <option value="hard">Hard Skill</option>
              <option value="soft">Soft Skill</option>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Статус</InputLabel>
            <Select
              native
              value={skillData.status}
              onChange={(e) =>
                setSkillData({ ...skillData, status: e.target.value })
              }
            >
              <option value="active">Активна</option>
              <option value="inactive">Неактивна</option>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Скасувати</Button>
          <Button onClick={handleSaveSkill} variant="contained">
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Skills;
