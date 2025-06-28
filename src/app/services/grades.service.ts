import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Student } from '../models/student.model';
import { Grade } from '../models/grade.model';
import { StudentGrades } from '../models/student-grades.model';

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  class: string;
  phone: string;
  subject: string;
}

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // רשימת תלמידות לדוגמה
  private students: Student[] = [
    { id: 1, name: 'שירה כהן' },
    { id: 2, name: 'מיכל לוי' },
    { id: 3, name: 'נועה גולדברג' },
    { id: 4, name: 'יעל רוזן' },
    { id: 5, name: 'דנה אברהם' }
  ];

  // ציונים לדוגמה לכל תלמידה
  private studentGrades: StudentGrades[] = [
    {
      student: { id: 1, name: 'שירה כהן' },
      grades: [
        { subject: 'מתמטיקה', score: 95 },
        { subject: 'אנגלית', score: 88 },
        { subject: 'היסטוריה', score: 92 }
      ]
    },
    {
      student: { id: 2, name: 'מיכל לוי' },
      grades: [
        { subject: 'מתמטיקה', score: 87 },
        { subject: 'אנגלית', score: 94 },
        { subject: 'היסטוריה', score: 89 }
      ]
    },
    {
      student: { id: 3, name: 'נועה גולדברג' },
      grades: [
        { subject: 'מתמטיקה', score: 91 },
        { subject: 'אנגלית', score: 85 },
        { subject: 'היסטוריה', score: 96 }
      ]
    },
    {
      student: { id: 4, name: 'יעל רוזן' },
      grades: [
        { subject: 'מתמטיקה', score: 83 },
        { subject: 'אנגלית', score: 90 },
        { subject: 'היסטוריה', score: 87 }
      ]
    },
    {
      student: { id: 5, name: 'דנה אברהם' },
      grades: [
        { subject: 'מתמטיקה', score: 96 },
        { subject: 'אנגלית', score: 92 },
        { subject: 'היסטוריה', score: 94 }
      ]
    }
  ];

  // פונקציה שמביאה רשימה של תלמידות
  getStudents(): Observable<Student[]> {
    return of(this.students);
  }

  // פונקציה שמחזירה רשימה של תלמידות עם הציונים שלהן
  getStudentsWithGrades(): Observable<StudentGrades[]> {
    return this.http.get<StudentGrades[]>(`${this.apiUrl}/students/grades`);
  }

  // פונקציה לקבלת ציונים של תלמידה ספציפית לפי ID
  getStudentGrades(studentId: number): Observable<StudentGrades | undefined> {
    const studentGrade = this.studentGrades.find(sg => sg.student.id === studentId);
    return of(studentGrade);
  }

  // קבלת רשימת מורות מהשרת
  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.apiUrl}/teachers`);
  }

  // שליחת פרטי טופס לשרת
  submitDetails(details: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/details`, details);
  }
} 