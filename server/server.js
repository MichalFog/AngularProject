const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// יצירת מסד נתונים
const db = new sqlite3.Database('./school.db');

// יצירת טבלאות
db.serialize(() => {
  // טבלת תלמידות
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    class TEXT,
    phone TEXT,
    city TEXT,
    street TEXT,
    house TEXT,
    apartment TEXT,
    age INTEGER,
    elementary_school TEXT
  )`);

  // טבלת מורות
  db.run(`CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL,
    class TEXT,
    phone TEXT,
    subject TEXT
  )`);

  // טבלת ציונים
  db.run(`CREATE TABLE IF NOT EXISTS grades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    mark INTEGER NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students (student_id)
  )`);

  // הכנסת נתונים לדוגמה
  const sampleStudents = [
    { student_id: '123456789', name: 'שירה כהן', password: 'password123', class: 'י"א א' },
    { student_id: '234567890', name: 'מיכל לוי', password: 'password123', class: 'י"ב ב' },
    { student_id: '345678901', name: 'נועה גולדברג', password: 'password123', class: 'י"א ג' }
  ];

  const sampleTeachers = [
    { teacher_id: '111111111', first_name: 'שירה', last_name: 'כהן', password: 'teacher123', class: 'י"א א', subject: 'מתמטיקה' },
    { teacher_id: '222222222', first_name: 'מיכל', last_name: 'לוי', password: 'teacher123', class: 'י"ב ב', subject: 'אנגלית' },
    { teacher_id: '333333333', first_name: 'נועה', last_name: 'גולדברג', password: 'teacher123', class: 'י"א ג', subject: 'היסטוריה' }
  ];

  const sampleGrades = [
    { student_id: '123456789', subject: 'מתמטיקה', mark: 95 },
    { student_id: '123456789', subject: 'אנגלית', mark: 88 },
    { student_id: '234567890', subject: 'מתמטיקה', mark: 87 },
    { student_id: '234567890', subject: 'אנגלית', mark: 94 },
    { student_id: '345678901', subject: 'מתמטיקה', mark: 91 },
    { student_id: '345678901', subject: 'אנגלית', mark: 85 }
  ];

  // הכנסת תלמידות
  const insertStudent = db.prepare('INSERT OR IGNORE INTO students (student_id, name, password, class) VALUES (?, ?, ?, ?)');
  sampleStudents.forEach(student => {
    const hashedPassword = bcrypt.hashSync(student.password, 10);
    insertStudent.run(student.student_id, student.name, hashedPassword, student.class);
  });
  insertStudent.finalize();

  // הכנסת מורות
  const insertTeacher = db.prepare('INSERT OR IGNORE INTO teachers (teacher_id, first_name, last_name, password, class, subject) VALUES (?, ?, ?, ?, ?, ?)');
  sampleTeachers.forEach(teacher => {
    const hashedPassword = bcrypt.hashSync(teacher.password, 10);
    insertTeacher.run(teacher.teacher_id, teacher.first_name, teacher.last_name, hashedPassword, teacher.class, teacher.subject);
  });
  insertTeacher.finalize();

  // הכנסת ציונים
  const insertGrade = db.prepare('INSERT OR IGNORE INTO grades (student_id, subject, mark) VALUES (?, ?, ?)');
  sampleGrades.forEach(grade => {
    insertGrade.run(grade.student_id, grade.subject, grade.mark);
  });
  insertGrade.finalize();
});

// API Routes

// אימות כניסה
app.post('/api/login', (req, res) => {
  const { id, password } = req.body;
  
  // בדיקה אם זה תלמיד
  db.get('SELECT * FROM students WHERE student_id = ?', [id], (err, student) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (student && bcrypt.compareSync(password, student.password)) {
      return res.json({ 
        success: true, 
        role: 'student', 
        user: { id: student.student_id, name: student.name }
      });
    }
    
    // בדיקה אם זה מורה
    db.get('SELECT * FROM teachers WHERE teacher_id = ?', [id], (err, teacher) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (teacher && bcrypt.compareSync(password, teacher.password)) {
        return res.json({ 
          success: true, 
          role: 'teacher', 
          user: { id: teacher.teacher_id, name: `${teacher.first_name} ${teacher.last_name}` }
        });
      }
      
      res.status(401).json({ error: 'Invalid credentials' });
    });
  });
});

// קבלת רשימת תלמידות עם ציונים
app.get('/api/students/grades', (req, res) => {
  db.all(`
    SELECT s.student_id, s.name, g.subject, g.mark
    FROM students s
    LEFT JOIN grades g ON s.student_id = g.student_id
    ORDER BY s.student_id, g.subject
  `, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // ארגון הנתונים במבנה שביקשת
    const studentsMap = {};
    rows.forEach(row => {
      if (!studentsMap[row.student_id]) {
        studentsMap[row.student_id] = {
          id: parseInt(row.student_id),
          marks: []
        };
      }
      if (row.subject && row.mark) {
        studentsMap[row.student_id].marks.push({
          subject: row.subject,
          mark: row.mark
        });
      }
    });
    
    const students = Object.values(studentsMap);
    res.json(students);
  });
});

// קבלת רשימת מורות
app.get('/api/teachers', (req, res) => {
  db.all('SELECT teacher_id, first_name, last_name, class, phone, subject FROM teachers', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    const teachers = rows.map(row => ({
      id: parseInt(row.teacher_id),
      firstName: row.first_name,
      lastName: row.last_name,
      class: row.class,
      phone: row.phone,
      subject: row.subject
    }));
    
    res.json(teachers);
  });
});

// שמירת פרטי טופס
app.post('/api/details', (req, res) => {
  const { firstName, phone, id, city, street, house, apartment, age, class: className, elementarySchool } = req.body;
  
  // ולידציות
  const errors = [];
  
  if (!firstName) errors.push('שם פרטי הוא שדה חובה');
  if (!phone || !/^0[2-9]\d{7,8}$/.test(phone)) errors.push('מספר טלפון לא תקין');
  if (!id || !/^\d{9}$/.test(id)) errors.push('ת"ז לא תקינה');
  if (!city) errors.push('עיר היא שדה חובה');
  if (!street) errors.push('רחוב הוא שדה חובה');
  if (!house) errors.push('בית הוא שדה חובה');
  if (!apartment) errors.push('דירה היא שדה חובה');
  if (!age || age < 1 || age > 120) errors.push('יש להזין גיל תקין');
  if (!className) errors.push('כיתה היא שדה חובה');
  if (age > 14 && !elementarySchool) errors.push('באיזה בית ספר יסודי למדת הוא שדה חובה');
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      errors: errors 
    });
  }
  
  // שמירה למסד נתונים
  db.run(`
    INSERT INTO students (student_id, name, phone, city, street, house, apartment, age, class, elementary_school)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, firstName, phone, city, street, house, apartment, age, className, elementarySchool], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ 
      success: true, 
      message: 'הפרטים נקלטו בהצלחה במערכת',
      studentId: this.lastID 
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 