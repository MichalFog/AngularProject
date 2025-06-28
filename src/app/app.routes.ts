import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { DetailsComponent } from './components/details/details.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'students', component: StudentsListComponent },
  { path: 'teachers', component: TeachersComponent },
  { path: 'details', component: DetailsComponent },
  { path: 'grades', loadComponent: () => import('./components/grades/grades.component').then(m => m.GradesComponent) },
  { path: '**', redirectTo: 'login' }
]; 