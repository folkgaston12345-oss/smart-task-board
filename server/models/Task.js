const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Work', 'Personal', 'Study'], 
    default: 'Personal' 
  }, // ตามโจทย์ Task & Category
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'], 
    default: 'Medium' 
  }, // ตามโจทย์ Priority Tag
  isCompleted: { 
    type: Boolean, 
    default: false 
  }, // สำหรับ Real-time Status
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Task', TaskSchema);