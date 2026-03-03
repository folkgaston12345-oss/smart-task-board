import { useState, useEffect } from 'react'
import axios from 'axios'

// ดึง URL จาก .env (VITE_API_URL=http://localhost:5000)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Personal')
  const [priority, setPriority] = useState('Medium')

  // 1. ดึงข้อมูลจาก MongoDB (Database Sync)
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`)
      setTasks(res.data)
    } catch (err) {
      console.error("Error fetching tasks:", err)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  // 2. ฟังก์ชันเพิ่มงานใหม่ (Task & Category + Priority Tag)
  const addTask = async (e) => {
    e.preventDefault()
    if (!title) return
    try {
      await axios.post(`${API_URL}/tasks`, { title, category, priority })
      setTitle('') // ล้างช่องกรอก
      fetchTasks() // อัปเดตรายการ
    } catch (err) {
      console.error("Error adding task:", err)
    }
  }

  // 3. ฟังก์ชันสลับสถานะ (Real-time Status: Pending / Completed)
  const toggleStatus = async (id) => {
    try {
      await axios.put(`${API_URL}/tasks/${id}`)
      fetchTasks()
    } catch (err) {
      console.error("Error updating status:", err)
    }
  }

  // 4. ฟังก์ชันลบงาน
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`)
      fetchTasks()
    } catch (err) {
      console.error("Error deleting task:", err)
    }
  }

  // ฟังก์ชันช่วยกำหนดสีตามระดับความสำคัญ (Priority Color)
  const getPriorityStyle = (p) => {
    switch(p) {
      case 'High': return { color: 'red', fontWeight: 'bold' }
      case 'Medium': return { color: 'orange', fontWeight: 'bold' }
      case 'Low': return { color: 'green', fontWeight: 'bold' }
      default: return { color: 'black' }
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial' }}>
      <h1>Smart Task Board 📋</h1>
      
      {/* ส่วนฟอร์มเพิ่มงานตาม Project Requirements */}
      <form onSubmit={addTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text"
          placeholder="ชื่อกิจกรรม..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 2, padding: '8px' }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ flex: 1 }}>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ flex: 1 }}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>เพิ่มงาน</button>
      </form>

      <hr />

      {/* รายการงานที่ดึงมาจาก Database */}
      <div style={{ marginTop: '20px' }}>
        {tasks.map(task => (
          <div key={task._id} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            marginBottom: '10px', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: task.isCompleted ? '#f9f9f9' : '#fff'
          }}>
            <div>
              <span style={{ 
                textDecoration: task.isCompleted ? 'line-through' : 'none',
                fontSize: '1.1em',
                color: task.isCompleted ? '#888' : '#000'
              }}>
                {task.title}
              </span>
              <div style={{ fontSize: '0.85em', marginTop: '5px' }}>
                <span style={{ color: '#555', marginRight: '10px' }}>📂 {task.category}</span>
                <span style={getPriorityStyle(task.priority)}>🔥 {task.priority}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => toggleStatus(task._id)} style={{ border: 'none', background: 'none', fontSize: '1.2em', cursor: 'pointer' }}>
                {task.isCompleted ? '✅' : '⏳'}
              </button>
              <button onClick={() => deleteTask(task._id)} style={{ border: 'none', background: 'none', fontSize: '1.2em', cursor: 'pointer' }}>
                🗑️
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>ยังไม่มีงานในรายการ...</p>}
      </div>
    </div>
  )
}

export default App