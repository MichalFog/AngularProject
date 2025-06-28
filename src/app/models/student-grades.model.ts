import { Student } from './student.model';
import { Grade } from './grade.model';

export interface StudentGrades {
  student: Student;
  grades: Grade[];
} 