import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Personal')
  const [priority, setPriority] = useState('Medium')

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`)
      setTasks(res.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetchTasks() }, [])

  const addTask = async (e) => {
    e.preventDefault()
    if (!title) return
    try {
      await axios.post(`${API_URL}/tasks`, { title, category, priority })
      setTitle(''); fetchTasks()
    } catch (err) { console.error(err) }
  }

  const toggleStatus = async (id) => {
    try {
      await axios.put(`${API_URL}/tasks/${id}`); fetchTasks()
    } catch (err) { console.error(err) }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`); fetchTasks()
    } catch (err) { console.error(err) }
  }

  return (
    <div className="app-page">
      <div className="task-board-container">
        <h1>Smart Task Board 📋</h1>
        
        <form onSubmit={addTask} className="task-form">
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="ชื่อกิจกรรม..." 
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button type="submit">เพิ่มงาน</button>
        </form>

        <div className="task-list">
          {tasks.map(task => (
            /* ดึงค่า task.priority มาสร้าง class เช่น priority-High เพื่อแสดงสี */
            <div key={task._id} className={`task-item priority-${task.priority}`}>
              <div>
                <div className="task-info-main" style={{ 
                  textDecoration: task.isCompleted ? 'line-through' : 'none',
                  color: task.isCompleted ? '#bdc3c7' : 'black'
                }}>
                  {task.title}
                </div>
                <div className="task-info-sub">
                  <span>📂 {task.category}</span> | <span>🔥 {task.priority}</span>
                </div>
              </div>
              <div className="task-actions">
                <button onClick={() => toggleStatus(task._id)}>
                  {task.isCompleted ? '✅' : '⏳'}
                </button>
                <button onClick={() => deleteTask(task._id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>ยังไม่มีงานในรายการ...</p>}
        </div>
      </div>
    </div>
  )
}

export default App