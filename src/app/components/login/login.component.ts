import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  id: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    if (!this.id || !this.password) {
      this.error = 'יש להזין ת"ז וסיסמא';
      return;
    }

    this.loading = true;
    this.error = '';

    this.http.post('http://localhost:3000/api/login', {
      id: this.id,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          localStorage.setItem('userRole', response.role);
          localStorage.setItem('userName', response.user.name);
          localStorage.setItem('userId', response.user.id);
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 401) {
          this.error = 'ת"ז או סיסמא שגויים';
        } else {
          this.error = 'שגיאה בחיבור לשרת';
        }
      }
    });
  }
} 