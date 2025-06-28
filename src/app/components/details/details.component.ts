import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GradesService } from '../../services/grades.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  detailsForm: FormGroup;
  showSuccess = false;
  showErrors = false;
  errors: string[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private gradesService: GradesService
  ) {
    this.detailsForm = this.fb.group({
      firstName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^0[2-9]\d{7,8}$/)]],
      id: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      house: ['', [Validators.required]],
      apartment: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      class: ['', [Validators.required]],
      elementarySchool: ['']
    });
  }

  ngOnInit(): void {
    // מעקב אחר שינויי גיל להצגת/הסתרת שדה בית ספר יסודי
    this.detailsForm.get('age')?.valueChanges.subscribe(age => {
      const elementarySchoolControl = this.detailsForm.get('elementarySchool');
      if (age > 14) {
        elementarySchoolControl?.setValidators([Validators.required]);
      } else {
        elementarySchoolControl?.clearValidators();
      }
      elementarySchoolControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.detailsForm.valid) {
      this.isLoading = true;
      this.showSuccess = false;
      this.showErrors = false;
      this.errors = [];

      this.gradesService.submitDetails(this.detailsForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.showSuccess = true;
            this.detailsForm.reset();
          } else {
            this.showErrors = true;
            this.errors = response.errors || ['שגיאה לא ידועה'];
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.showErrors = true;
          if (error.error && error.error.errors) {
            this.errors = error.error.errors;
          } else {
            this.errors = ['שגיאה בחיבור לשרת'];
          }
        }
      });
    } else {
      this.showErrors = true;
      this.errors = ['יש לתקן את השגיאות בטופס'];
    }
  }

  get showElementarySchool(): boolean {
    const age = this.detailsForm.get('age')?.value;
    return age > 14;
  }
} 