import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  Checkbox,
  IconButton,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // Date selected by user
  const [selectedTime, setSelectedTime] = useState(null); // Time selected by user

  // Load tasks from session storage
  useEffect(() => {
    const storedTasks = sessionStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to session storage
  useEffect(() => {
    if (tasks.length > 0) {
      sessionStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleAddTask = () => {
    if (taskInput.trim() !== "" && selectedDate && selectedTime) {
      const newTask = {
        text: taskInput,
        completed: false,
        createdAt: `${selectedDate.toLocaleDateString()} ${selectedTime.toLocaleTimeString()}`,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTaskInput("");
      setSelectedDate(null);
      setSelectedTime(null);
    } else {
      alert("Please enter a task, select a date, and select a time.");
    }
  };

  const handleEditTask = (index) => {
    setTaskInput(tasks[index].text);
    setEditingIndex(index);
    const taskDate = new Date(tasks[index].createdAt);
    setSelectedDate(taskDate); // Set the selected date for editing
    setSelectedTime(taskDate); // Set the selected time for editing
  };

  const handleUpdateTask = () => {
    if (taskInput.trim() !== "" && selectedDate && selectedTime) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex].text = taskInput;
      updatedTasks[
        editingIndex
      ].createdAt = `${selectedDate.toLocaleDateString()} ${selectedTime.toLocaleTimeString()}`;
      setTasks(updatedTasks);
      setTaskInput("");
      setSelectedDate(null);
      setSelectedTime(null);
      setEditingIndex(null);
    } else {
      alert("Please enter a task, select a date, and select a time.");
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((task, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleToggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const handleCancelEdit = () => {
    setTaskInput("");
    setSelectedDate(null);
    setSelectedTime(null);
    setEditingIndex(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
        padding: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center" color="primary">
            To-Do Listt
          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <TextField
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              label={editingIndex !== null ? "Edit Task" : "New Task"}
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
            />
          </Box>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <DatePicker
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                label="Select Date"
                renderInput={(params) => <TextField {...params} />}
              />
              <TimePicker
                value={selectedTime}
                onChange={(newValue) => setSelectedTime(newValue)}
                label="Select Time"
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
          </LocalizationProvider>

          <Box display="flex" justifyContent="flex-end" sx={{ marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={editingIndex !== null ? handleUpdateTask : handleAddTask}
            >
              {editingIndex !== null ? "Update" : "Add"}
            </Button>
          </Box>

          <List>
            {tasks.map((task, index) => (
              <ListItem
                key={index}
                sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleToggleComplete(index)}
                  sx={{ color: task.completed ? "green" : "black" }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                  >
                    {task.text}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {task.createdAt} {/* Display the selected date and time */}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => handleEditTask(index)}
                  sx={{ color: "black" }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteTask(index)}
                  sx={{ color: "black" }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </CardContent>

        {/* Add a small padding space between the card content and actions */}
        <CardActions
          sx={{ justifyContent: "center", paddingBottom: 2 }}
        ></CardActions>
      </Card>
    </Box>
  );
};

export default TodoApp;
