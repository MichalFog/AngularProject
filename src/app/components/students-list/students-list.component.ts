import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradesService } from '../../services/grades.service';
import { StudentGrades } from '../../models/student-grades.model';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.css']
})
export class StudentsListComponent implements OnInit {
  studentsWithGrades: StudentGrades[] = [];
  isLoading = false;
  showGrades = false;

  constructor(private gradesService: GradesService) { }

  ngOnInit(): void {
  }

  // פונקציה לקבלת רשימת התלמידות עם הציונים
  loadStudentsWithGrades(): void {
    this.isLoading = true;
    this.gradesService.getStudentsWithGrades().subscribe({
      next: (data) => {
        this.studentsWithGrades = data;
        this.showGrades = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('שגיאה בטעינת התלמידות:', error);
        this.isLoading = false;
      }
    });
  }

  // פונקציה לחישוב ממוצע ציונים לתלמידה
  calculateAverage(grades: any[]): number {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((total, grade) => total + grade.score, 0);
    return Math.round(sum / grades.length);
  }
} 