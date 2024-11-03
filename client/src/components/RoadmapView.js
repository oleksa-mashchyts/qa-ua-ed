import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Checkbox,
  Collapse,
  TextField,
  IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore, Add, Save } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const RoadmapView = () => {
  const [roadmap, setRoadmap] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [newCategory, setNewCategory] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const { currentUser } = useAuth();
  const userId = currentUser._id;

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/roadmap`);
        setRoadmap(response.data);
      } catch (error) {
        console.error("Error fetching roadmap:", error);
      }
    };
    fetchRoadmap();
  }, [userId]);

  const toggleExpand = (category) => {
    setExpanded({ ...expanded, [category]: !expanded[category] });
  };

  const handleAddCategory = async () => {
    const updatedRoadmap = [
      ...roadmap,
      { category: newCategory, subcategories: [] },
    ];
    setRoadmap(updatedRoadmap);
    setNewCategory("");

    // Збереження на сервері
    await axios.patch(`/api/users/${userId}/roadmap`, {
      roadmap: updatedRoadmap,
    });
  };

  const handleAddGoal = async (categoryIndex, subcategoryIndex) => {
    const updatedRoadmap = [...roadmap];
    const newGoalObj = { title: newGoal, completed: false };
    updatedRoadmap[categoryIndex].subcategories[subcategoryIndex].goals.push(
      newGoalObj
    );
    setRoadmap(updatedRoadmap);
    setNewGoal("");

    // Збереження на сервері
    await axios.patch(`/api/users/${userId}/roadmap`, {
      roadmap: updatedRoadmap,
    });
  };

  const handleGoalComplete = async (
    categoryIndex,
    subcategoryIndex,
    goalIndex
  ) => {
    const updatedRoadmap = [...roadmap];
    const goal =
      updatedRoadmap[categoryIndex].subcategories[subcategoryIndex].goals[
        goalIndex
      ];
    goal.completed = !goal.completed;
    setRoadmap(updatedRoadmap);

    // Збереження на сервері
    await axios.patch(`/api/users/${userId}/roadmap`, {
      roadmap: updatedRoadmap,
    });
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">Roadmap</Typography>

      <Box sx={{ display: "flex", gap: 1, my: 2 }}>
        <TextField
          label="Нова категорія"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={handleAddCategory}
        >
          Додати категорію
        </Button>
      </Box>

      <List>
        {roadmap.map((category, categoryIndex) => (
          <Box key={categoryIndex} sx={{ mt: 2 }}>
            <ListItem button onClick={() => toggleExpand(category.category)}>
              <ListItemText primary={category.category} />
              {expanded[category.category] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={expanded[category.category]}
              timeout="auto"
              unmountOnExit
            >
              {category.subcategories.map((subcategory, subIndex) => (
                <Box key={subIndex} sx={{ ml: 3 }}>
                  <Typography variant="h6">{subcategory.name}</Typography>
                  <Box sx={{ display: "flex", gap: 1, my: 1 }}>
                    <TextField
                      label="Нове завдання"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                    />
                    <IconButton
                      onClick={() => handleAddGoal(categoryIndex, subIndex)}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  {subcategory.goals.map((goal, goalIndex) => (
                    <ListItem key={goalIndex} sx={{ pl: 3 }}>
                      <Checkbox
                        checked={goal.completed}
                        onChange={() =>
                          handleGoalComplete(categoryIndex, subIndex, goalIndex)
                        }
                      />
                      <ListItemText primary={goal.title} />
                    </ListItem>
                  ))}
                </Box>
              ))}
            </Collapse>
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default RoadmapView;
