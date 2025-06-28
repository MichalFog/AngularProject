import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface StudentMark {
  id: number;
  marks: { subject: string; mark: number }[];
}

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent {
  students: StudentMark[] = [
    { id: 12345, marks: [ { subject: 'מתמטיקה', mark: 100 }, { subject: 'אנגלית', mark: 95 } ] },
    { id: 23456, marks: [ { subject: 'מתמטיקה', mark: 87 }, { subject: 'אנגלית', mark: 90 } ] },
    { id: 34567, marks: [ { subject: 'מתמטיקה', mark: 78 }, { subject: 'אנגלית', mark: 85 } ] },
    { id: 45678, marks: [ { subject: 'מתמטיקה', mark: 92 }, { subject: 'אנגלית', mark: 88 } ] },
  ];
} 