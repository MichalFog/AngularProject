import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GradesService, Teacher } from '../../services/grades.service';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];
  isLoading = false;

  constructor(private gradesService: GradesService) { }

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.isLoading = true;
    this.gradesService.getTeachers().subscribe({
      next: (data) => {
        this.teachers = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('שגיאה בטעינת המורות:', error);
        this.isLoading = false;
      }
    });
  }
} 