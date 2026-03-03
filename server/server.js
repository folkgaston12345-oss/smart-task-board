require('dotenv').config(); // โหลด MONGO_URI จากไฟล์ .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // สำหรับ Lab นี้อนุญาตให้ทุกที่ต่อเข้ามาก่อน

// เชื่อมต่อ MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ Connection error:', err));

// --- API Routes ---

// 1. ดึงงานทั้งหมด
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// 2. เพิ่มงานใหม่ (ต้องมี title, category, priority)
app.post('/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

// 3. สลับสถานะ Pending / Completed
app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.isCompleted = !task.isCompleted;
  await task.save();
  res.json(task);
});

// 4. ลบงาน
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));